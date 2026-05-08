import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function SignUpPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "", role: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3000/signup", form);
      alert("User created successfully!");
      navigate("/");
    } catch (error) {
      console.error(error);
      alert("Error creating user.");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            className="w-full p-2 border rounded mb-3"
            value={form.username}
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full p-2 border rounded mb-3"
            value={form.password}
            onChange={handleChange}
          />
          <input
            type="text"
            name="role"
            placeholder="Role"
            className="w-full p-2 border rounded mb-3"
            value={form.role}
            onChange={handleChange}
          />
          <button
            type="submit"
            className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Create User
          </button>
        </form>
      </div>
    </div>
  );
}