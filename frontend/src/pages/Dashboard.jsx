// pages/Dashboard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './dashboard.css';

const features = [
  {
    title: 'Savings Goal Tracker',
    path: '/savings',
    desc: 'Set financial targets and watch them grow.',
    icon: '/icons/savings.svg',
  },
  {
    title: 'Income/Expense Graph',
    path: '/graph',
    desc: 'Visualize your earnings vs. spending.',
    icon: '/icons/graph.svg',
  },
  {
    title: 'SIP Return Simulator',
    path: '/simulator',
    desc: 'Plan your SIP and future wealth.',
    icon: '/icons/sip.svg',
  },
  {
    title: 'Net Worth Prediction',
    path: '/predict',
    desc: 'Forecast your financial future.',
    icon: '/icons/networth.svg',
  },
  {
    title: 'Transaction History',
    path: '/transactions',
    desc: 'Track every rupee with clarity.',
    icon: '/icons/history.svg',
  },
  {
    title: 'AI Financial Chat',
    path: '/gemini',
    desc: 'Ask your money questions, get AI answers.',
    icon: '/icons/chat.svg',
  },

];

const Dashboard = () => {
  const navigate = useNavigate();
  const userName = localStorage.getItem('userName') || 'User';

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      {/* 🔵 Top-right logout button */}
      <div className="logout-container">
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </div>

      {/* 🟢 Hello Message */}
      <h2 className="greeting">Hello, <strong>{userName}</strong></h2>

      <h1 className="dashboard-title">Your FinVista Dashboard 🚀</h1>
      <p className="dashboard-sub">Tap into your financial future</p>

      <div className="dashboard-grid">
        {features.map((feature, idx) => (
          <div key={idx} className="dashboard-card" onClick={() => navigate(feature.path)}>
            <img src={feature.icon} alt={`${feature.title} icon`} className="card-icon" />
            <h3 className="card-title">{feature.title}</h3>
            <p className="card-desc">{feature.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
