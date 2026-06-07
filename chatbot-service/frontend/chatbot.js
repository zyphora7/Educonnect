const API_URL = "http://localhost:8000/chat";

function toggleSidebar() {
  document.getElementById("sidebar").classList.toggle("collapsed");
}

function appendMessage(role, text) {
  const box = document.getElementById("chat-box");

  const div = document.createElement("div");
  div.className = role === "user" ? "user" : "bot";
  div.textContent = text;

  box.appendChild(div);

  // ✅ AUTO SCROLL (IMPORTANT)
  box.scrollTop = box.scrollHeight;
}

async function sendMessage() {
  const input = document.getElementById("chat-input");
  const message = input.value.trim();

  if (!message) return;

  appendMessage("user", message);
  input.value = "";

  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message })
  });

  const data = await res.json();
  appendMessage("bot", data.response);
}