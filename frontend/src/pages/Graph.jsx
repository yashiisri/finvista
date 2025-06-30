import React, { useEffect, useState } from 'react';
import './graph.css';
import { Bar, Pie } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

const Graph = () => {
  const [chartData, setChartData] = useState({});
  const [summary, setSummary] = useState({ income: 0, expense: 0 });
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('income');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [showPie, setShowPie] = useState(false);

  // ✅ Read userId from localStorage
  const userId = localStorage.getItem('userId');

  const fetchData = async () => {
    if (!userId) {
      alert('User not logged in!');
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/transactions/chart/${userId}`);
      const data = await res.json();

      if (!data || typeof data !== 'object') return;

      const labels = Object.keys(data);
      const incomeData = labels.map(label => data[label]?.income || 0);
      const expenseData = labels.map(label => data[label]?.expense || 0);

      setSummary({
        income: incomeData.reduce((a, b) => a + b, 0),
        expense: expenseData.reduce((a, b) => a + b, 0),
      });

      setChartData({
        labels,
        datasets: [
          {
            label: 'Income',
            data: incomeData,
            backgroundColor: '#00ffbdcc',
          },
          {
            label: 'Expenses',
            data: expenseData,
            backgroundColor: '#ff4d4dcc',
          },
        ],
      });
    } catch (err) {
      console.error('Error loading chart:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      alert('User not logged in!');
      return;
    }

    const amt = Number(amount);
    if (!amt || isNaN(amt)) {
      alert('Enter a valid amount');
      return;
    }

    const res = await fetch('http://localhost:5000/api/transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        type,
        amount: amt,
        category,
        date: date || new Date().toISOString(),
      }),
    });

    if (res.ok) {
      alert('✅ Transaction added successfully!');
      setAmount('');
      setCategory('');
      setDate('');
      setType('income');
      fetchData();
    } else {
      const err = await res.json();
      alert('❌ Failed to add transaction: ' + err.error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const balance = summary.income - summary.expense;

  return (
    <div className="graph-container">
      <h1 className="graph-title">📊 Income vs Expense Analysis</h1>
      <p className="graph-sub">Stay in control of your finances.</p>

      <div className="add-transaction-form">
        <h2>Add a Transaction</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <input
              type="number"
              placeholder="Amount (₹)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
            <select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
            <input
              type="text"
              placeholder="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            <button type="submit">Add</button>
          </div>
        </form>
      </div>

      <div className="summary-cards">
        <div className="card income">
          <h3>💰 Total Income</h3>
          <p>₹{summary.income}</p>
        </div>
        <div className="card expense">
          <h3>💸 Total Expenses</h3>
          <p>₹{summary.expense}</p>
        </div>
        <div className={`card balance ${balance < 0 ? 'negative' : 'positive'}`}>
          <h3>🧮 Balance</h3>
          <p>₹{balance}</p>
        </div>
      </div>

      <div className="toggle-btn">
        <button onClick={() => setShowPie(!showPie)}>
          {showPie ? '📊 Show Bar Chart' : '🥧 Show Pie Chart'}
        </button>
      </div>

      <div className="chart-box">
        {chartData.labels?.length > 0 ? (
          showPie ? (
            <Pie
              data={{
                labels: ['Income', 'Expenses'],
                datasets: [
                  {
                    label: 'Financial Breakdown',
                    data: [summary.income, summary.expense],
                    backgroundColor: ['#00ffbd', '#ff4d4d'],
                  },
                ],
              }}
            />
          ) : (
            <Bar data={chartData} />
          )
        ) : (
          <p>Loading chart...</p>
        )}
      </div>

      <div className="graph-footer">
        <button onClick={() => window.location.href = '/dashboard'} className="back-button">
          ⬅ Back
        </button>
      </div>
    </div>
  );
};

export default Graph;
