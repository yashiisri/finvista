import React, { useEffect, useRef, useState } from 'react';
import './aiFinancialChat.css';

const AIFinancialChat = () => {
  const [query, setQuery] = useState('');
  const [conversation, setConversation] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    fetchChatHistory();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation]);

  const fetchChatHistory = async () => {
    try {
      const res = await fetch(`https://finvista-backendd.onrender.com/api/chat/${userId}`);
      const data = await res.json();
      const formatted = data.map(c => ([
        {
          role: 'user',
          content: c.question,
          timestamp: new Date(c.createdAt).toLocaleTimeString()
        },
        {
          role: 'bot',
          content: c.answer,
          timestamp: new Date(c.createdAt).toLocaleTimeString()
        }
      ])).flat();
      setConversation(formatted);
    } catch (err) {
      console.error('History load error:', err);
    }
  };

  const handleDeleteHistory = async () => {
    if (!window.confirm('⚠️ Are you sure you want to delete all chat history?')) return;
    try {
      await fetch(`https://finvista-backendd.onrender.com/api/chat/${userId}`, {
        method: 'DELETE',
      });
      setConversation([]);
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      alert('Failed to delete history');
    }
  };

  const askAI = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    const userMsg = {
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString()
    };
    setConversation(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const response = await fetch('https://finvista-backendd.onrender.com/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, question: query }),
      });

      const data = await response.json();
      const botMsg = {
        role: 'bot',
        content: data.answer || 'No response',
        timestamp: new Date().toLocaleTimeString()
      };

      setConversation(prev => [...prev, botMsg]);
    } catch (error) {
      console.error('Frontend error:', error);
      setConversation(prev => [...prev, {
        role: 'bot',
        content: '❌ Gemini failed to respond',
        timestamp: new Date().toLocaleTimeString()
      }]);
    }

    setQuery('');
    setLoading(false);
  };

  return (
    <div className="chat-container">
      <h1 className="chat-title">🤖 AI Financial Chat</h1>
      <p className="chat-sub">Ask financial questions and get AI-powered advice instantly!</p>

      <div className="chat-box">
        {conversation.length === 0 && (
          <p className="empty-chat">Start by asking a question below 👇</p>
        )}
        {conversation.map((msg, index) => (
          <div key={index} className={`chat-bubble ${msg.role}`}>
            <p>{msg.content}</p>
            <span className="timestamp">{msg.timestamp}</span>
          </div>
        ))}
        {loading && (
          <div className="chat-bubble bot">
            <p>⌛ Thinking...</p>
          </div>
        )}
        <div ref={chatEndRef}></div>
      </div>

      <form className="chat-form" onSubmit={askAI}>
        <input
          type="text"
          placeholder="Ask about taxes, savings, investments..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>

      <div className="delete-history-container">
        <button className="delete-history-btn" onClick={handleDeleteHistory}>
          🗑️ Delete Chat History
        </button>
      </div>

      <div className="back-button-container">
        <button className="back-button" onClick={() => window.location.href = '/dashboard'}>
          ⬅ Back
        </button>
      </div>
    </div>
  );
};

export default AIFinancialChat;
