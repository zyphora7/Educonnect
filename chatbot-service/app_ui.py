import streamlit as st
from app import ask_llm, search_local, search_web

st.title("💙 Mental Health Chatbot")

user_input = st.chat_input("Ask something...")

if user_input:

    local_context = search_local(user_input)
    web_context = search_web(user_input)

    final_context = (
        local_context +
        "\n\nWEB INFO:\n" +
        web_context
    )

    response = ask_llm(user_input, final_context)

    st.chat_message("user").write(user_input)
    st.chat_message("assistant").write(response)