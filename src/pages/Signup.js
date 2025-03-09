import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Signup.css';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // ✅ Handle Signup
  const handleSignup = (e) => {
    e.preventDefault();

    // ✅ Get existing users from localStorage
    const existingUsers = JSON.parse(localStorage.getItem("users")) || {};

    if (existingUsers[email]) {
      setError("❌ Email already exists. Try logging in.");
      return;
    }

    // ✅ Generate a unique user ID
    const userId = Date.now().toString();

    // ✅ Store new user in localStorage
    existingUsers[email] = { id: userId, name, password };
    localStorage.setItem("users", JSON.stringify(existingUsers));

    // ✅ Log in user automatically after signup
    localStorage.setItem("userId", userId);
    localStorage.setItem("userName", name);

    navigate("/dashboard"); // ✅ Redirect to dashboard
  };

  return (
    <div className="signup-container">
      <h2>📝 Create an Account</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSignup}>
        <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Sign Up</button>
      </form>
      <p>Already have an account? <a href="/login">Login</a></p>
    </div>
  );
};

export default Signup;
