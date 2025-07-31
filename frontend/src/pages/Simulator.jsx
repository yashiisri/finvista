import React, { useState } from 'react';
import './sipSimulator.css';
import { Pie } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

const SipSimulator = () => {
  const [monthlyInvestment, setMonthlyInvestment] = useState('');
  const [annualRate, setAnnualRate] = useState('');
  const [years, setYears] = useState('');
  const [age, setAge] = useState('');
  const [result, setResult] = useState(null);
  const [geminiReply, setGeminiReply] = useState('');
  const [yearlyBreakdown, setYearlyBreakdown] = useState([]);
  const [isLoading, setIsLoading] = useState(false);


  const calculateSIP = async (e) => {
    e.preventDefault();

    const P = parseFloat(monthlyInvestment);
    const r = parseFloat(annualRate) / 12 / 100;
    const n = parseInt(years) * 12;

    if (!P || !r || !n) {
      alert('Invalid input');
      return;
    }

    const FV = P * (((Math.pow(1 + r, n) - 1) * (1 + r)) / r);
    const invested = P * n;
    const gain = FV - invested;

    setResult({
      investedAmount: invested.toFixed(2),
      gain: gain.toFixed(2),
      totalValue: FV.toFixed(2),
    });

    // 📅 Year-wise breakdown calculation
    const breakdown = [];
    for (let i = 1; i <= parseInt(years); i++) {
      const ni = i * 12;
      const fv = P * (((Math.pow(1 + r, ni) - 1) * (1 + r)) / r);
      const investedSoFar = P * ni;
      const gainSoFar = fv - investedSoFar;

      breakdown.push({
        year: i,
        invested: investedSoFar.toFixed(2),
        value: fv.toFixed(2),
        gain: gainSoFar.toFixed(2),
      });
    }
    setYearlyBreakdown(breakdown);

    try {
      setIsLoading(true); 

      const response = await fetch('https://finvista-backendd.onrender.com/api/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          monthlyInvestment: P,
          annualRate: parseFloat(annualRate),
          years: parseInt(years),
          gain: gain.toFixed(2),
          futureValue: FV.toFixed(2),
          age: age || 'N/A',
        }),
      });

      const data = await response.json();
      console.log('Gemini API reply:', data);
      setGeminiReply(data.reply);
    } catch (err) {
      console.error(err);
      setGeminiReply('❌ Gemini failed to respond');
    }
     finally {
  setIsLoading(false); // ✅ Done loading
}
  };

  return (
    <div className="sip-container">
      <h1 className="sip-title">📈 SIP Investment Simulator</h1>
      <p className="sip-sub">Plan your future wealth with monthly investments and AI advice.</p>

      <div className="sip-features">
        <span>💰 SIP Simulation ✅</span>
        <span>📊 Graphs ✅</span>
        <span>🤖 AI Tips ✅</span>
      </div>

      <form className="sip-form" onSubmit={calculateSIP}>
        <input
          type="number"
          placeholder="Monthly Investment"
          value={monthlyInvestment}
          onChange={(e) => setMonthlyInvestment(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Expected Annual Return (%)"
          value={annualRate}
          onChange={(e) => setAnnualRate(e.target.value)}
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
          placeholder="Your Age (optional)"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />
        <button type="submit">Calculate & Ask AI</button>
      </form>

      {result && (
        <>
          <div className="sip-result">
            <p>📥 Invested: ₹{result.investedAmount}</p>
            <p>📈 Returns: ₹{result.gain}</p>
            <p>💰 Total: ₹{result.totalValue}</p>
          </div>

          <div className="sip-graph">
            <Pie
              data={{
                labels: ['Invested', 'Gain'],
                datasets: [
                  {
                    data: [result.investedAmount, result.gain],
                    backgroundColor: ['#00f5d4', '#00bbf9'],
                    borderColor: ['#00e0c0', '#0096c7'],
                    borderWidth: 1,
                  },
                ],
              }}
            />
          </div>
        </>
      )}

      {yearlyBreakdown.length > 0 && (
        <div className="yearly-breakdown">
          <h3>📆 Year-wise SIP Growth</h3>
          <table>
            <thead>
              <tr>
                <th>Year</th>
                <th>Invested (₹)</th>
                <th>Gain (₹)</th>
                <th>Total Value (₹)</th>
              </tr>
            </thead>
            <tbody>
              {yearlyBreakdown.map((row, i) => (
                <tr key={i}>
                  <td>{row.year}</td>
                  <td>{row.invested}</td>
                  <td>{row.gain}</td>
                  <td>{row.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isLoading ? (
  <div className="gemini-response">
    <h3>🤖 AI Suggestion:</h3>
    <p>⏳ Fetching intelligent suggestions...</p>
  </div>
) : (
  geminiReply && (
    <div className="gemini-response">
      <h3>🤖 AI Suggestion:</h3>
      <p>{geminiReply}</p>
    </div>
  )
)}


      <div className="graph-footer">
        <button onClick={() => window.location.href = '/dashboard'} className="back-button">
          ⬅ Back
        </button>
      </div>
    </div>
  );
};

export default SipSimulator;
