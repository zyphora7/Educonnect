import { useState } from "react";
import axios from "axios";

export default function StudentMentalChatbot() {

  const [message,setMessage] = useState("");
  const [reply,setReply] = useState("");

  const sendMessage = async () => {

    try {

      const res = await axios.post(
        "http://localhost:8000/chat",
        {
          message: message
        }
      );

      setReply(res.data.response);

    } catch(err) {

      console.log(err);

    }
  };

  return (
    <div>

      <h2>Mental Wellness Chatbot</h2>

      <input
        type="text"
        value={message}
        onChange={(e)=>setMessage(e.target.value)}
        placeholder="Talk here..."
      />

      <button onClick={sendMessage}>
        Send
      </button>

      <p>{reply}</p>

    </div>
  );
}