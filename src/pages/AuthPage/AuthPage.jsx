import { useState } from "react";
import axios from "axios";
import "./AuthPage.css";
import { Link } from "react-router-dom"

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const url = isLogin
        ? `${API_URL}/api/auth/login`
        : `${API_URL}/api/auth/signup`;

      const { data } = await axios.post(url, { email, password });

      if (isLogin) {
        localStorage.setItem("token", data.token);
        setMessage("✅ Logged in successfully!");
      } else {
        setMessage("✅ Account created successfully! Please login.");
        setIsLogin(true);
      }
    } catch (err) {
      setMessage(
        err.response?.data?.message || "❌ Something went wrong."
      );
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
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Link to='/main-dashboard'><button type="submit">
            {isLogin ? "Login" : "Sign Up"}
          </button>
          </Link>
        </form>

        {message && <p className="message">{message}</p>}

        <p className="toggle-text">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <span onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "Sign Up" : "Login"}
          </span>
        </p>
      </div>
    </div>
  );
}
