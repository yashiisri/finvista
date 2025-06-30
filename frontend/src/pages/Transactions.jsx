import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './transactions.css';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const userId = localStorage.getItem('userId');


  const fetchTransactions = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/user/${userId}`);
      setTransactions(res.data.transactions || []);
    } catch (err) {
      console.error('Failed to fetch transactions:', err);
    }
  };


  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <div className="transactions-container">
      <h1 className="transactions-title">💳 Transaction History</h1>
      <p className="transactions-sub">Track your incomes and expenses in one place.</p>

   

      <div className="transactions-list">
        <h2>📜 History</h2>
        {transactions.length === 0 ? (
          <p className="empty-history">No transactions found.</p>
        ) : (
          <ul>
            {transactions.map((t, i) => (
              <li key={i} className={t.type === 'income' ? 'income' : 'expense'}>
                <span>{new Date(t.date).toLocaleDateString()}</span>
                <span>{t.type.toUpperCase()}</span>
                <span>₹{t.amount}</span>
                <span>{t.category}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="back-button-container">
        <button className="back-button" onClick={() => window.location.href = '/dashboard'}>
          ⬅ Back 
        </button>
      </div>
    </div>
  );
};

export default Transactions;
