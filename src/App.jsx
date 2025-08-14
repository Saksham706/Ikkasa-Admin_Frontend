import React from "react";
import { Routes, Route} from "react-router-dom";
import AuthPage from "./pages/AuthPage/AuthPage";
import MainDashboard from "./MainDashboard"; 

export default function App() {
  const token = localStorage.getItem("token");

  return (
    <Routes>
      <Route path="/" element={<AuthPage />} />
      <Route
        path="/main-dashboard"
        element={<MainDashboard />}
      />
    </Routes>
  );
}
