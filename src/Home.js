// Home.js
import React from "react";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await logout();
      navigate("/login");
    } catch {
      console.log("Failed to log out");
    }
  }

  return (
    <div>
      <h2>Home</h2>
      <p>Welcome, {currentUser.email}!</p>
      <button onClick={handleLogout}>Log Out</button>
    </div>
  );
}