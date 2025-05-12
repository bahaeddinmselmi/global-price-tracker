import React, { useState } from 'react';
import { ChatbotService } from '../services/chatbotService';

const ChatbotInterface: React.FC = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const chatbot = new ChatbotService();

  const sendMessage = async () => {
    if (!input.trim()) return;

    // Add user message
    setMessages(prev => [...prev, `You: ${input}`]);

    // Get chatbot response
    const response = chatbot.processMessage(input);
    
    // Add chatbot response
    setMessages(prev => [...prev, `Bot: ${response.message}`]);
    
    // Clear input
    setInput('');
  };

  return (
    <div className="chatbot-container">
      <div className="messages-container">
        {messages.map((message, index) => (
          <div key={index} className="message">
            {message}
          </div>
        ))}
      </div>
      <div className="input-container">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Type your message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatbotInterface;
