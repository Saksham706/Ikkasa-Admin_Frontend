import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AuthPage.css";

const API_URL =  import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault();
  setMessage("");

  if (!email.trim() || !password.trim()) {
    setMessage("❌ Please enter email and password.");
    return;
  }

  try {
    const url = isLogin
      ? `${API_URL}/api/auth/login`
      : `${API_URL}/api/auth/signup`;

    const { data } = await axios.post(url, { email, password });

    if (isLogin) {
      if (data?.token) {
        localStorage.setItem("token", data.token);
        setMessage("✅ Logged in successfully!");
        setTimeout(() => navigate("/main-dashboard"), 1000);
      } else {
        setMessage("❌ Login failed. No token received.");
      }
    } else {
      setMessage("✅ Account created successfully! Please login.");
      setIsLogin(true);
      setPassword("");
    }
  } catch (err) {
    setMessage(err.response?.data?.message || "❌ Something went wrong.");
  }
};


  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>{isLogin ? "Login" : "Sign Up"}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="username"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete={isLogin ? "current-password" : "new-password"}
          />
          <button type="submit">{isLogin ? "Login" : "Sign Up"}</button>
        </form>

        {message && <p className="message">{message}</p>}

        <p className="toggle-text">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <span
            className="toggle-link"
            onClick={() => {
              setIsLogin(!isLogin);
              setMessage("");
              setPassword("");
            }}
            style={{ cursor: "pointer", color: "#007bff" }}
          >
            {isLogin ? "Sign Up" : "Login"}
          </span>
        </p>
      </div>
    </div>
  );
}
