import React, { useState } from 'react';
import './register.css';
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { auth, provider, signInWithPopup } from '../firebase'; // make sure firebase.js exports these

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert("❌ Passwords don't match!");
      return;
    }

    try {
      const res = await fetch('https://finvista-backendd.onrender.com/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        alert('✅ Registration Successful. Please login now.');
        navigate('/login');
      } else {
        alert(data.error || 'Registration failed');
      }
    } catch (err) {
      console.error(err);
      alert('❌ An error occurred during registration');
    }
  };

  const handleGoogleSignup = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const res = await fetch('http://localhost:5000/api/google-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: user.displayName,
          email: user.email,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('userId', data.userId);
        localStorage.setItem('userEmail', data.email);
        localStorage.setItem('userName', data.name);
        alert('✅ Google Signup Successful!');
        navigate('/dashboard');
      } else {
        alert(data.error || 'Google signup failed');
      }
    } catch (err) {
      console.error('Google signup error:', err);
      alert('❌ Google signup failed');
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2 className="register-title">Join FinVista 🚀</h2>
        <p className="register-sub">Create your free account</p>

        <form onSubmit={handleRegister} className="register-form">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Create Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange}
            required
          />
          <button type="submit">Register</button>
        </form>

        <div className="or-divider">or</div>

        <button className="google-btn" onClick={handleGoogleSignup}>
          <FcGoogle className="google-icon" />
          Sign up with Google
        </button>

        <p className="register-footer">
          Already have an account? <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
};

export default Register;
