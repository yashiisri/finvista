import React, { useState, useEffect } from 'react';
import './savings.css';

const Savings = () => {
  const [amount, setAmount] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [description, setDescription] = useState('');
  const [goals, setGoals] = useState([]);

  const userId = localStorage.getItem('userId');

  // 🔥 Correct API call - only fetch logged-in user's savings goals
  const fetchGoals = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/savings/${userId}`);
      const data = await res.json();
      setGoals(data || []);
    } catch (err) {
      console.error('Error fetching goals:', err);
    }
  };

  const handleAddGoal = async (e) => {
    e.preventDefault();
    try {
      await fetch('http://localhost:5000/api/savings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, amount, targetDate, description }),
      });
      setAmount('');
      setTargetDate('');
      setDescription('');
      fetchGoals();
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      alert('❌ Failed to add savings goal.');
    }
  };

  const handleDelete = async (index) => {
    await fetch(`http://localhost:5000/api/savings/delete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, index }),
    });
    fetchGoals();
  };

  const handleComplete = async (index) => {
    await fetch(`http://localhost:5000/api/savings/complete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, index }),
    });
    fetchGoals();
  };

  useEffect(() => {
    if (userId) fetchGoals();
  }, [userId]);

  return (
    <div className="savings-container">
      <h1 className="savings-title">💸 Set Your Savings Goals</h1>
      <p className="savings-sub">Achieve your dreams, one rupee at a time.</p>

      <form className="savings-form" onSubmit={handleAddGoal}>
        <input type="number" placeholder="Target Amount (₹)" value={amount} onChange={(e) => setAmount(e.target.value)} required />
        <input type="date" value={targetDate} onChange={(e) => setTargetDate(e.target.value)} required />
        <input type="text" placeholder="Goal Description" value={description} onChange={(e) => setDescription(e.target.value)} required />
        <button type="submit">Add Goal</button>
      </form>

      <div className="goal-list">
        <h2>🎯 Your Current Goals</h2>
        {goals.length === 0 ? (
          <p className="empty-goals">No goals yet. Start saving today!</p>
        ) : (
          goals.map((goal, idx) => (
            <div className={`goal-card ${goal.completed ? 'completed' : ''}`} key={idx}>
              <h3>{goal.description}</h3>
              <p>Target: ₹{goal.amount}</p>
              <p>By: {new Date(goal.targetDate).toLocaleDateString()}</p>
              {goal.completed && <p className="completed-text">✅ Completed</p>}

              <div className="goal-actions">
                {!goal.completed && (
                  <button className="complete-btn" onClick={() => handleComplete(idx)}>
                    Mark as Completed
                  </button>
                )}
                <button className="delete-btn" onClick={() => handleDelete(idx)}>Delete</button>
              </div>
            </div>
          ))
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

export default Savings;
