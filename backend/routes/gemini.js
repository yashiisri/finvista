// routes/gemini.js
const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Load API key from .env
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post('/simulate', async (req, res) => {
  const { monthlyInvestment, annualRate, years, gain, futureValue } = req.body;

const prompt = `
I'm planning to invest ₹${monthlyInvestment} every month for ${years} years. 
I expect an annual return of ${annualRate}%, which gives me a total corpus of ₹${futureValue}, with total returns of ₹${gain}. 

Can you:
- Evaluate if this SIP strategy is effective for long-term wealth creation?
- Suggest any changes to improve the outcome based on current market trends and inflation?
- Recommend ideal monthly SIP or duration to reach a goal of ₹50 lakhs?

Please explain in simple, beginner-friendly language.
`;


  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // 🔁 Use `generateContentStream()` if needed for streaming
    const result = await model.generateContent(prompt);

    // ✅ This is the fix: extract response text correctly
    const replyText = result.response.parts[0].text;

    res.json({ reply: replyText });
  } catch (err) {
    console.error('🔥 Gemini Error:', err.message);
    res.status(500).json({ reply: 'Gemini failed to respond' });
  }
});

module.exports = router;
