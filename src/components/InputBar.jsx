import React, { useState } from "react";
import "./InputBar.css";

const InputBar = ({ addMessage }) => {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (input.trim()) {
      addMessage({ sender: "user", text: input });
      setInput("");
    }
  };

  return (
    <div className="input-bar">
      <input
        type="text"
        placeholder="Type your message..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
      />
      <button onClick={handleSend}>Send</button>
    </div>
  );
};

export default InputBar;
