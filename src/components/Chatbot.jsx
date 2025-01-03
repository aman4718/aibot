import React, { useEffect, useState } from "react";
import MessageList from "./MessageList";
import InputBar from "./InputBar";
import "./Chatbot.css";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [responses, setResponses] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveInput, setSaveInput] = useState("");
  const [selectedConversationIndex, setSelectedConversationIndex] = useState(null);
  const [showHelpMessage, setShowHelpMessage] = useState(true);

  const questions = [
    "Hi, what is the weather?",
    "Hi, what is my location?",
    "Hi, how are you?",
    "Hi, what is the temperature?",
  ];

  useEffect(() => {
    fetch("/sampleData.json")
      .then((response) => response.json())
      .then((data) => setResponses(data))
      .catch((error) => console.error("Error loading JSON:", error));
  }, []);

  const getRandomResponse = (question) => {
    const match = responses.find(
      (response) =>
        response.question.toLowerCase() === question.toLowerCase()
    );
    return match ? match.response : "I don't know the answer to that yet.";
  };

  const addMessage = (message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
    setShowHelpMessage(false);
    if (message.sender === "user") {
      setTimeout(() => {
        const aiMessage = {
          sender: "ai",
          text: getRandomResponse(message.text),
        };
        setMessages((prevMessages) => [...prevMessages, aiMessage]);

        if (selectedConversationIndex !== null) {
          setChatHistory((prevHistory) => {
            const updatedHistory = [...prevHistory];
            updatedHistory[selectedConversationIndex].messages = [
              ...updatedHistory[selectedConversationIndex].messages,
              message,
              aiMessage,
            ];
            return updatedHistory;
          });
        }
      }, 1000);
    }
  };

  const saveConversation = () => {
    if (selectedConversationIndex === null) {
      setIsSaving(true);
    }
  };

  const handleSave = () => {
    if (saveInput.trim()) {
      setChatHistory((prevHistory) => [
        ...prevHistory,
        { title: saveInput, messages },
      ]);
      setSaveInput("");
      setMessages([]);
      setSelectedConversationIndex(chatHistory.length); 
      setIsSaving(false);
    }
  };

  const startNewConversation = () => {
    setMessages([]);
    setSelectedConversationIndex(null);
    setShowHelpMessage(true);
  };

  const loadConversation = (index) => {
    setSelectedConversationIndex(index);
    setMessages(chatHistory[index].messages);
    setShowHelpMessage(false);
  };

  return (
    <div className="chatbot-main-container">
      <div className="chat-history">
        <h3>Chat History</h3>
        <ul>
          {chatHistory.map((chat, index) => (
            <li
              key={index}
              onClick={() => loadConversation(index)}
              style={{
                cursor: "pointer",
                fontWeight: selectedConversationIndex === index ? "bold" : "normal",
              }}
            >
              <strong>{chat.title}</strong>
            </li>
          ))}
        </ul>
        {isSaving && (
          <div className="save-input">
            <input
              type="text"
              placeholder="Enter conversation title"
              value={saveInput}
              onChange={(e) => setSaveInput(e.target.value)}
            />
            <button onClick={handleSave}>Save</button>
          </div>
        )}
        <button className="new-conversation-btn" onClick={startNewConversation}>
          Start New Conversation
        </button>
      </div>

      <div className="chatbot-container">
        <header className="chatbot-header">AI Chatbot</header>
        <div className="suggestions">
          {questions.map((question, index) => (
            <button
              key={index}
              className="suggestion-btn"
              onClick={() => addMessage({ sender: "user", text: question })}
            >
              {question}
            </button>
          ))}
        </div>
        {showHelpMessage && (
          <div className="help-message">
            <h2>How may I help you today?</h2>
          </div>
        )}
        <MessageList messages={messages} />
        <InputBar addMessage={addMessage} />
        <button className="save-btn" onClick={saveConversation}>
          Save Conversation
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
