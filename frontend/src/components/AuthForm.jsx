// components/AuthForm.jsx
import React from 'react';

const AuthForm = ({ email, password, onChange, onSubmit, type }) => (
  <form onSubmit={onSubmit} className="auth-form">
    <input name="email" type="email" value={email} onChange={onChange} placeholder="Email" required />
    <input name="password" type="password" value={password} onChange={onChange} placeholder="Password" required />
    <button type="submit">{type === "login" ? "Login" : "Sign Up"}</button>
  </form>
);

export default AuthForm;
