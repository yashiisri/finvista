// pages/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import bank from '../assets/bank.jpg'; // or use an external link if you don’t have local image

const Home = () => {
  return (
    <div className="home-container">
      <div className="text-section">
        <h1 className="glow-title">FinVista</h1>
        <p className="tagline">Master your money. Predict your future. 💰</p>

        <p className="subtext">
          FinVista helps you take control of your finances like never before.  
          Whether you're saving for a car 🚗, planning investments 📈, or just want to know where your money goes 💸 — we've got you covered.
        </p>

        <ul className="features-list">
          <li>🎯 Set and track smart savings goals</li>
          <li>📊 Visualize income and spending patterns</li>
          <li>🧠 Get AI-powered SIP & Net Worth predictions</li>
          <li>📁 Review all transactions at a glance</li>
        </ul>

        <div className="home-buttons">
          <Link to="/login"><button className="btn">Login</button></Link>
          <Link to="/register"><button className="btn secondary">Sign Up</button></Link>
        </div>
      </div>

      <div className="image-section">
        <img
          src={bank}
          alt="Bank illustration"
          className="bank-image large"
        />
      </div>
    </div>
  );
};

export default Home;
