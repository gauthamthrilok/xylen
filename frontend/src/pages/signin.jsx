// src/LoginPage.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  // No longer need the isAdmin state here for navigation
  // const [isAdmin, setIsAdmin] = useState(false); 

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3000/signin", {
        username,
        password,
      });
      console.log(res.data);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userRole", res.data.role);
      alert("Login successful!");

      // Determine if the user is an admin from the response
      const userIsAdmin = res.data.role === "admin";
      console.log("User is admin:", userIsAdmin);

      // Pass the admin status directly in the navigation state
      navigate("/", { state: { isAdmin: userIsAdmin } });
      
    } catch (error) {
      console.error(error);
      alert("Login failed.");
    }
  };

  const handleSignUpClick = () => {
    const adminPassword = prompt("Enter Admin Password:");
    if (adminPassword === "admin123") {
      navigate("/signup");
    } else {
      alert("Invalid Admin Password!");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign In</h2>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            className="w-full p-2 border rounded mb-3"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 border rounded mb-3"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="flex justify-between">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={handleSignUpClick}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}