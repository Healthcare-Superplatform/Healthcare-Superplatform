import React, { useState } from "react";
import axios from "axios";
import "../styles/Login.css";

const Login = ({ onLoginSuccess, setIsLoggedIn }) => {
  const [ssn, setSSN] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    const users = JSON.parse(localStorage.getItem("users")) || {};
    let localUser = users[ssn];

    if (!localUser) {
      try {
        const res = await axios.get("http://localhost:5001/users");
        const apiUsers = res.data;

        const matchedUser = apiUsers.find((user) => user.SSN === ssn);

        if (!matchedUser) {
          setError("❌ SSN not found. Please sign up first.");
          return;
        }

        if (matchedUser.password !== password) {
          setError("❌ Incorrect password.");
          return;
        }

        users[ssn] = {
          id: matchedUser._id,
          name: matchedUser.name,
          password: matchedUser.password,
        };
        localStorage.setItem("users", JSON.stringify(users));
        localUser = users[ssn];
      } catch (error) {
        console.error("❌ API Error:", error);
        setError("❌ Failed to login. Try again later.");
        return;
      }
    }

    if (localUser.password !== password) {
      setError("❌ Incorrect password.");
      return;
    }

    localStorage.setItem("ssn", ssn);
    localStorage.setItem("userId", localUser.id);
    localStorage.setItem("userName", localUser.name);

    if (onLoginSuccess) {
      onLoginSuccess({
        SSN: ssn,
        id: localUser.id,
        name: localUser.name,
      });
    }

    // ✅ Trigger re-render in parent
    if (setIsLoggedIn) {
      setIsLoggedIn(true);
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
