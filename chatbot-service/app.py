import os
from pyexpat.errors import messages
from dotenv import load_dotenv
from groq import Groq
import chromadb
from sentence_transformers import SentenceTransformer
from tavily import TavilyClient
from langchain_text_splitters import RecursiveCharacterTextSplitter
from fastapi import FastAPI

app = FastAPI()
load_dotenv()

# ---------------- INIT ----------------
groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))
tavily = TavilyClient(api_key=os.getenv("TAVILY_API_KEY"))

embedding_model = SentenceTransformer("all-MiniLM-L6-v2")

chroma_client = chromadb.PersistentClient(path="chroma_db")
collection = chroma_client.get_or_create_collection("chatbot")


# ---------------- LOAD FILE ----------------
def load_text():
    with open("data/mental.txt", "r", encoding="utf-8") as f:
        return f.read()


# ---------------- CHUNK ----------------
def chunk_text(text):

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=100
    )

    return splitter.split_text(text)


# ---------------- STORE IN CHROMA ----------------
def store(chunks):
    for i, chunk in enumerate(chunks):
        emb = embedding_model.encode(chunk).tolist()
        collection.add(
            ids=[str(i)],
            embeddings=[emb],
            documents=[chunk]
        )


# ---------------- LOCAL RAG SEARCH ----------------
def search_local(query):
    q_emb = embedding_model.encode(query).tolist()
    res = collection.query(query_embeddings=[q_emb], n_results=3)
    return "\n".join(res["documents"][0])


# ---------------- WEB SEARCH (TAVILY) ----------------
@app.post("/chat")
def search_web(query):
    try:
        res = tavily.search(query=query, max_results=2)
        return "\n".join([r["content"] for r in res["results"]])
    except:
        return ""

chat_history=[]
MAX_HISTORY = 10
student_memory = {}
# ---------------- LLM RESPONSE ----------------
def ask_llm(query, context):
    # if user_id not in student_memory:
    #     student_memory[user_id]=[]

    global chat_history
    
    messages=[
        {
            "role": "system",
            "content": (
                "You are a helpful mental health assistant. "
                "Use context + web info if needed. Be supportive and safe."
            )
        },
    ]
    chat_history = chat_history[-MAX_HISTORY:]
    messages.extend(chat_history)

    messages.append(
        {
            "role": "user",
            "content": f"""
Context:
{context}

User Question:
{query}
"""
            })
    
    
    response = groq_client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=messages,
        stream = True
    )

    answer=""

    print("\nBot: ", end="")
    for chunk in response:

        token = chunk.choices[0].delta.content

        if token:
            print(token,end="",flush=True)
            answer+=token
    print()

    chat_history.append({"role":"user","content":query})
    chat_history.append({"role":"assistant","content":answer})
   
    return answer


# ---------------- MAIN ----------------
if __name__ == "__main__":

    text = load_text()
    chunks = chunk_text(text)

    if collection.count() == 0:
        store(chunks)

    print("\n💙 RAG + Web Chatbot Ready (Groq + Tavily)\n")

    while True:
        q = input("You: ")

        if q.lower() == "exit":
            break

        local_context = search_local(q)
        web_context = search_web(q)

        final_context = local_context + "\n\nWEB INFO:\n" + web_context

        answer = ask_llm(q, final_context)
