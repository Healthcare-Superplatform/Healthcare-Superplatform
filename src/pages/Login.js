import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // ✅ Handle Login
  const handleLogin = (e) => {
    e.preventDefault();

    // ✅ Retrieve registered users from localStorage
    const users = JSON.parse(localStorage.getItem("users")) || {};

    if (users[email] && users[email].password === password) {
      localStorage.setItem("userId", users[email].id); // ✅ Store userId
      localStorage.setItem("userName", users[email].name); // ✅ Store userName
      navigate("/dashboard"); // ✅ Redirect to Dashboard
    } else {
      setError("❌ Invalid email or password. Try again.");
    }
  };

  return (
    <div className="login-container">
      <h2>🔐 Login</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleLogin}>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Login</button>
      </form>
      <p>New user? <a href="/signup">Sign Up</a></p>
    </div>
  );
};

export default Login;
