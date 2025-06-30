import React, { useState } from 'react';
import './networthPredictor.css';

const NetworthPredictor = () => {
  const [currentSavings, setCurrentSavings] = useState('');
  const [monthlyInvestment, setMonthlyInvestment] = useState('');
  const [annualReturn, setAnnualReturn] = useState('');
  const [years, setYears] = useState('');
  const [age, setAge] = useState('');

  const [predictedNetworth, setPredictedNetworth] = useState(null);
  const [breakdown, setBreakdown] = useState([]);
  const [milestones, setMilestones] = useState([]);

  const calculateNetworth = (e) => {
    e.preventDefault();

    const P = parseFloat(monthlyInvestment);
    const r = parseFloat(annualReturn) / 12 / 100;
    const n = parseInt(years) * 12;
    const initial = parseFloat(currentSavings);

    if (!P || !r || !n || isNaN(initial)) {
      alert('Please fill all values correctly.');
      return;
    }

    // Future value calculation with initial savings
    const FV = P * (((Math.pow(1 + r, n) - 1) * (1 + r)) / r) + initial * Math.pow(1 + r, n);
    setPredictedNetworth(FV.toFixed(2));

    // Year-wise breakdown
    const tempBreakdown = [];
    for (let i = 1; i <= parseInt(years); i++) {
      const ni = i * 12;
      const yearlyFV = P * (((Math.pow(1 + r, ni) - 1) * (1 + r)) / r) + initial * Math.pow(1 + r, ni);
      tempBreakdown.push({
        year: i,
        age: age ? parseInt(age) + i : 'N/A',
        networth: yearlyFV.toFixed(2),
      });
    }
    setBreakdown(tempBreakdown);

    // Milestone prediction
    const milestoneList = [];
    if (FV >= 1000000) milestoneList.push("🎯 Crossed ₹10 Lakhs");
    if (FV >= 5000000) milestoneList.push("🚀 Crossed ₹50 Lakhs");
    if (FV >= 10000000) milestoneList.push("🏆 Crossed ₹1 Crore");
    if (FV >= 50000000) milestoneList.push("🌟 Crossed ₹5 Crore");
    if (FV >= 100000000) milestoneList.push("👑 Crossed ₹10 Crore");

    setMilestones(milestoneList);
  };

  return (
    <div className="networth-container">
      <h1 className="networth-title">💼 Net Worth Predictor</h1>
      <p className="networth-sub">
        Estimate your future net worth based on your current savings, SIPs, and returns.
      </p>

      <form className="networth-form" onSubmit={calculateNetworth}>
        <input
          type="number"
          placeholder="Current Savings (₹)"
          value={currentSavings}
          onChange={(e) => setCurrentSavings(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Monthly Investment (₹)"
          value={monthlyInvestment}
          onChange={(e) => setMonthlyInvestment(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Expected Annual Return (%)"
          value={annualReturn}
          onChange={(e) => setAnnualReturn(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Time Period (Years)"
          value={years}
          onChange={(e) => setYears(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Your Current Age (Optional)"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />
        <button type="submit">Predict My Net Worth</button>
      </form>

      {predictedNetworth && (
        <div className="networth-result">
          <h2>📊 Projected Net Worth: ₹{predictedNetworth}</h2>
        </div>
      )}

      {milestones.length > 0 && (
        <div className="milestone-box">
          <h3>🏁 Key Milestone Predictions</h3>
          <ul>
            {milestones.map((m, i) => (
              <li key={i}>{m}</li>
            ))}
          </ul>
        </div>
      )}

      {breakdown.length > 0 && (
        <div className="yearly-breakdown">
          <h3>📆 Yearly Breakdown</h3>
          <table>
            <thead>
              <tr>
                <th>Year</th>
                <th>Age</th>
                <th>Projected Net Worth (₹)</th>
              </tr>
            </thead>
            <tbody>
              {breakdown.map((row, i) => (
                <tr key={i}>
                  <td>{row.year}</td>
                  <td>{row.age}</td>
                  <td>{row.networth}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="back-button-container">
        <button
          className="back-button"
          onClick={() => (window.location.href = '/dashboard')}
        >
          ⬅ Back
        </button>
      </div>
    </div>
  );
};

export default NetworthPredictor;
