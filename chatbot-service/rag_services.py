import requests
import pdfplumber


from groq import Groq
import os
from dotenv import load_dotenv

load_dotenv()

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)
# ----------------------------
# OpenAI setup
# ----------------------------


# ----------------------------
# In-memory cache
# ----------------------------
pdf_cache = {}

# ----------------------------
# 1. Download PDF
# ----------------------------
def download_pdf(url):
    response = requests.get(url)
    return response.content

# ----------------------------
# 2. Extract text from PDF
# ----------------------------
def extract_text(pdf_bytes):
    text = ""

    with open("temp.pdf", "wb") as f:
        f.write(pdf_bytes)

    with pdfplumber.open("temp.pdf") as pdf:
        for page in pdf.pages:
            text += page.extract_text() or ""

    return text

# ----------------------------
# 3. Chunk text
# ----------------------------
def chunk_text(text, size=1000):
    return [text[i:i+size] for i in range(0, len(text), size)]

# ----------------------------
# 4. Simple retrieval (keyword-based MVP)
# ----------------------------
def get_top_chunks(chunks, question):
    q_words = question.lower().split()

    scored = []

    for chunk in chunks:
        score = 0
        lower_chunk = chunk.lower()

        for word in q_words:
            if len(word) > 2 and word in lower_chunk:
                score += 1

        scored.append((chunk, score))

    scored.sort(key=lambda x: x[1], reverse=True)

    return [c[0] for c in scored[:5]]

# ----------------------------
# 5. MAIN FUNCTION
# ----------------------------
def ask_pdf_question(pdf_url, question):

    # Step 1: check cache
    if pdf_url in pdf_cache:
        chunks = pdf_cache[pdf_url]
    else:
        print("📄 Processing PDF...")

        pdf_bytes = download_pdf(pdf_url)
        text = extract_text(pdf_bytes)
        chunks = chunk_text(text)

        pdf_cache[pdf_url] = chunks

        print("✅ PDF cached with chunks:", len(chunks))

    # Step 2: retrieve relevant chunks
    top_chunks = get_top_chunks(chunks, question)
    context = "\n\n".join(top_chunks)

    # Step 3: ask GPT
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "system",
                "content": "Answer ONLY from the provided PDF context. If not found, say 'Not found in document'."
            },
            {
                "role": "user",
                "content": f"Context:\n{context}\n\nQuestion: {question}"
            }
        ]
    )

    return response.choices[0].message.content


# ----------------------------
# 6. TEST RUN
# ----------------------------
if __name__ == "__main__":

    cloudinary_pdf = "https://res.cloudinary.com/demo/raw/upload/sample.pdf"

    while True:
        q = input("\nAsk question: ")

        if q.lower() == "exit":
            break

        answer = ask_pdf_question(cloudinary_pdf, q)
        print("\n🤖 Answer:", answer)