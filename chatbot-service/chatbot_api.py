from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from app import ask_llm, search_local,search_web

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