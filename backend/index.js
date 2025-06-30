const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');

require('dotenv').config();
const app = express();
app.use(cors());
app.use(express.json());
const bcrypt = require('bcrypt');


// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  
  savingsGoals: [{
    amount: Number,
    targetDate: Date,
    description: String,
    completed: { type: Boolean, default: false }
  }],

  // 🔧 FIXED: Define transactions as an ARRAY of objects
  transactions: [{
    type: { type: String, required: true },
    amount: { type: Number, required: true },
    category: { type: String, required: true },
    date: { type: Date, default: Date.now },
  }],
   chats: [{
    question: { type: String, required: true },
    answer: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
  }]
});


const User = mongoose.model('User', userSchema);

// Register
// Backend: /api/register
app.post('/api/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10); // 🔐 hash password

    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    res.status(201).json({
      message: 'User registered',
      userId: user._id,
      name: user.name
    });
  } catch (error) {
    res.status(400).json({ error: 'Registration failed' });
  }
});


// Login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Step 1: Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: '❌ Invalid email or password' });
    }

    // Step 2: Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: '❌ Invalid email or password' });
    }

    // Step 3: Return success
    res.status(200).json({
      message: '✅ Login successful',
      userId: user._id,
      name: user.name,
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: '❌ Server error during login' });
  }
});


app.post('/api/savings', async (req, res) => {
  const { userId, amount, targetDate, description } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.savingsGoals.push({
      amount,
      targetDate,
      description,
      completed: false
    });

    await user.save();
    res.status(201).json({ message: 'Goal added successfully' });
  } catch (err) {
    console.error('Add goal error:', err.message);
    res.status(500).json({ error: 'Failed to add goal' });
  }
});


// Add Savings Goal
// GET savings goals for a specific user
app.get('/api/savings/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user.savingsGoals);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch savings goals' });
  }
});


// Mark Savings Goal Completed
app.post('/api/savings/complete', async (req, res) => {
  const { userId, index } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user || index >= user.savingsGoals.length) {
      return res.status(404).json({ error: 'Invalid user or goal index' });
    }
    user.savingsGoals[index].completed = true;
    await user.save();
    res.json({ message: 'Goal marked as completed' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to mark goal complete' });
  }
});
app.post('/api/google-auth', async (req, res) => {
  const { name, email } = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        name,
        email,
        password: await bcrypt.hash('google-auth', 10),
        fromGoogle: true,
      });
      await user.save();
    }

    res.json({
      userId: user._id,
      name: user.name,
      email: user.email,
    });
  } catch (err) {
    res.status(500).json({ error: 'Google authentication failed' });
  }
});


// Delete Savings Goal
app.post('/api/savings/delete', async (req, res) => {
  const { userId, index } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user || index >= user.savingsGoals.length) {
      return res.status(404).json({ error: 'Invalid user or goal index' });
    }
    user.savingsGoals.splice(index, 1);
    await user.save();
    res.json({ message: 'Goal deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete goal' });
  }
});
// Get savings goals for a specific user
app.get('/api/savings/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json(user.savingsGoals || []);
  } catch (err) {
    console.error('Error fetching savings goals:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.post('/api/transactions', async (req, res) => {
  const { userId, type, amount, category, date } = req.body;

  console.log('📥 Received:', req.body); // Debug incoming request

  try {
    if (!userId || !type || !amount || !category) {
      console.log('❌ Missing fields');
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const user = await User.findById(userId);
    if (!user) {
      console.log('❌ No user found with ID:', userId);
      return res.status(404).json({ error: 'User not found' });
    }

    const transaction = {
      type,
      amount: Number(amount),
      category,
      date: date ? new Date(date) : new Date(),
    };

    console.log('📦 Inserting Transaction:', transaction);

    user.transactions.push(transaction);
    await user.save(); // 🔥 Likely error is happening here

    console.log('✅ Transaction saved successfully');
    res.json({ message: 'Transaction added' });
  } catch (err) {
    console.error('🔥 Error in transaction route:', err.message);
    res.status(500).json({ error: 'Failed to add transaction' });
  }
});

// Chart Summary Route
app.get('/api/transactions/chart/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const grouped = {};

    user.transactions.forEach((tx) => {
      const d = new Date(tx.date);
      const key = `${d.getMonth() + 1}/${d.getFullYear()}`;
      if (!grouped[key]) grouped[key] = { income: 0, expense: 0 };

      if (tx.type === 'income') grouped[key].income += tx.amount;
      else if (tx.type === 'expense') grouped[key].expense += tx.amount;
    });

    res.json(grouped);
  } catch (err) {
    console.error('Chart fetch error:', err.message);
    res.status(500).json({ error: 'Failed to fetch chart data' });
  }
});

// Get User
app.get('/api/user/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Gemini Integration
app.post('/api/simulate', async (req, res) => {
  const { monthlyInvestment, annualRate, years, gain, futureValue } = req.body;

  const query = `I am planning to invest ₹${monthlyInvestment} per month for ${years} years at an expected return of ${annualRate}%. I expect to gain ₹${gain} and end up with ₹${futureValue}. 
What are your suggestions? Can you provide tips to maximize returns or reduce risk?`;

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('❌ GEMINI_API_KEY is missing!');
      return res.status(500).json({ reply: 'Server config error: Gemini API key not found.' });
    }

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        contents: [{ parts: [{ text: query }] }],
      },
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );

    const reply = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No result';
    res.json({ reply });
  } catch (error) {
    console.error('🔥 Gemini error:', error.response?.data || error.message);
    res.status(500).json({ reply: 'Simulation failed' });
  }
});

// AI Chat Route - Ask & Save
app.post('/api/chat', async (req, res) => {
  const { userId, question } = req.body;

  if (!question || !userId) return res.status(400).json({ error: 'Missing question or userId' });

  const prompt = `You are a financial advisor. Answer this user question in a helpful, easy way:\n\n"${question}"`;

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        contents: [{ parts: [{ text: prompt }] }],
      },
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );

    const answer = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No AI response available.';

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.chats.push({ question, answer });
    await user.save();

    res.json({ answer });
  } catch (err) {
    console.error('❌ Chat error:', err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to get AI response' });
  }
});

// Get Chat History for User
app.get('/api/chat/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json(user.chats.reverse()); // Most recent first
  } catch (err) {
    console.error('❌ Chat history error:', err.message);
    res.status(500).json({ error: 'Failed to fetch chat history' });
  }
});
// DELETE chat history
app.delete('/api/chat/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.chats = [];
    await user.save();
    res.json({ message: 'Chat history cleared' });
  } catch (err) {
    console.error('❌ Delete error:', err.message);
    res.status(500).json({ error: 'Failed to delete chat history' });
  }
});



// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
