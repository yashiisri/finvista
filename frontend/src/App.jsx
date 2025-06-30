// App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Import all page components
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Savings from './pages/Savings';
import Transactions from './pages/Transactions';
import Simulator from './pages/Simulator';
import Prediction from './pages/Prediction';
import Graph from './pages/Graph';
import AIFinancialChat from './pages/gemini';

const App = () => {
  return (
    <div style={{ minHeight: '100vh', width: '100%' }}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/savings" element={<Savings />} />
        <Route path='/graph' element={<Graph/>}/>
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/simulator" element={<Simulator />} />
        <Route path="/predict" element={<Prediction />} />
        <Route path="gemini" element={<AIFinancialChat/>}/>
        
        {/* Optional 404 fallback */}
        <Route path="*" element={<div style={{ padding: '2rem', textAlign: 'center' }}>404 - Page Not Found</div>} />
      </Routes>
    </div>
  );
};

export default App;
