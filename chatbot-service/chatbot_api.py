from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from app import ask_llm, search_local,search_web
from rag_services import ask_pdf_question

app = FastAPI()

# Allow React frontend connection
app.add_middleware(
    CORSMiddleware,
    # allow_origins=["*"],
    allow_origins=["http://localhost:5173"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str

class PDFChatRequest(BaseModel):
    pdfUrl: str
    question: str

@app.post("/chat")
def chat(req: ChatRequest):

    q = req.message

    local_context = search_local(q)
    web_context = search_web(q)

    final_context = (
        local_context +
        "\nWEB INFO:\n" +
        web_context
    )

    answer = ask_llm(q, final_context)

    return {
        "response": answer
    }

@app.post("/chat/pdf")
def chat_pdf(data: PDFChatRequest):
    answer = ask_pdf_question(data.pdfUrl, data.question)
    return {"answer": answer}