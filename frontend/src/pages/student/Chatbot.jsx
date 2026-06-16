import { useState, useRef, useEffect } from "react";

const API_URL = "http://localhost:8000/chat";

export default function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const chatEndRef = useRef(null);

  // Auto-scroll to latest message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const currentInput = input;

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        text: currentInput,
      },
    ]);

    setInput("");
    setLoading(true);

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: currentInput,
        }),
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: data.response,
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: "⚠️ Unable to connect to MindMate.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="
          fixed
          bottom-6
          right-6
          w-16
          h-16
          rounded-full
          bg-gradient-to-r
          from-blue-500
          to-indigo-600
          text-white
          text-3xl
          shadow-xl
          hover:scale-110
          transition
          animate-pulse
          z-50
        "
      >
        🧠
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div
            className="
            bottom-20 right-6
            w-[min(850px,90vw)]
            h-[min(450px,80vh)]
            bg-white
            rounded-2xl
            shadow-2xl
            border
            flex
            flex-col
            z-50
            transition-all duration-200
          "
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-4 rounded-t-2xl flex justify-between items-center">
            <div>
              <h2 className="font-bold">🧠 MindMate</h2>
              <p className="text-xs opacity-90">
                Your Mental Wellness Assistant
              </p>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="text-lg hover:opacity-70"
            >
              ✖
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {messages.length === 0 && (
              <div className="text-center text-gray-500 text-sm mt-10">
                👋 Hi! I'm MindMate.
                <br />
                How are you feeling today?
              </div>
            )}

            {messages.map((msg, i) => (
              <div
                key={i}
                className={`max-w-[80%] px-4 py-3 rounded-2xl break-words ${
                  msg.role === "user"
                    ? "ml-auto bg-blue-100 text-gray-800"
                    : "mr-auto bg-green-100 text-gray-800"
                }`}
              >
                <div className="text-xs font-semibold mb-1">
                  {msg.role === "user" ? "You" : "MindMate"}
                </div>

                <div>{msg.text}</div>
              </div>
            ))}

            {loading && (
              <div className="mr-auto bg-green-100 px-4 py-3 rounded-2xl">
                <div className="text-xs font-semibold mb-1">
                  MindMate
                </div>

                Thinking...
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t p-3 flex gap-2 bg-white rounded-b-2xl">
            <input
              type="text"
              value={input}
              placeholder="Share what's on your mind..."
              className="
                flex-1
                border
                rounded-xl
                px-3
                py-2
                outline-none
                focus:ring-2
                focus:ring-blue-300
              "
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  sendMessage();
                }
              }}
            />

            <button
              onClick={sendMessage}
              disabled={loading}
              className="
                bg-blue-500
                text-white
                px-4
                rounded-xl
                hover:bg-blue-600
                disabled:opacity-50
              "
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}