import React from "react";
import "./MessageList.css";

const MessageList = ({ messages }) => {
    console.log(messages.sender)
  return (
    <div className="message-list">
      {messages.map((msg, index) => (
        <div key={index} className={`message ${msg.sender}`}>
          {msg.text}
        </div>
      ))}
    </div>
  );
};

export default MessageList;
