import React, { useState } from "react";
import axios from "axios"; // Ensure axios is imported
import "../styles/Login.css";

const Login = ({ onLoginSuccess }) => {
  // Accept onLoginSuccess as prop
  const [ssn, setSSN] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // ✅ Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();

    // Get the SSN and password from localStorage (if they exist)
    const localStorageSSN = localStorage.getItem("ssn");
    const localStoragePassword = JSON.parse(localStorage.getItem("users"))?.[
      localStorageSSN
    ]?.password;

    if (!localStorageSSN) {
      setError("❌ No SSN found in localStorage. Please sign up first.");
      return;
    }

    // Validate SSN and password in localStorage
    if (localStorageSSN !== ssn) {
      setError("❌ SSN does not match.");
      return;
    }

    if (localStoragePassword !== password) {
      setError("❌ Incorrect password.");
      return;
    }

    try {
      // Fetch user data from API
      const res = await axios.get("http://localhost:5001/users");
      const users = res.data;

      // Find the user by SSN
      const user = users.find((user) => user.SSN === ssn);

      if (user) {
        // Pass user data to the parent component
        onLoginSuccess(user); // Call the onLoginSuccess callback with user data
      } else {
        setError("❌ User not found in database.");
      }
    } catch (error) {
      console.error("API Error:", error); // Log the error for debugging
      setError("❌ Failed to login. Try again later.");
    }
  };

  return (
    <div className="login-container">
      <h2>🔐 Login</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="SSN"
          value={ssn}
          onChange={(e) => setSSN(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
      <p>
        New user? <a href="/signup">Create an account</a>
      </p>
    </div>
  );
};

export default Login;
