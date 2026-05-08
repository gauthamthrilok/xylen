// src/Landing.jsx

import { Package, Truck, BarChart3 } from "lucide-react";
// Import useEffect
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();
  const [isLogged, setLogged] = useState(false);

  const handleSignIn = () => {
    console.log("sign in clicked");
    navigate("/signin");
  };

  const handleStart = () => {
    const userRole = localStorage.getItem("userRole");
    const isAdmin = userRole === "admin";

    if (isAdmin && isLogged) {
      navigate("/admintables");
    } else if (isLogged) {
      navigate("/stafftables");
    } else {
      navigate("/signin");
    }

    console.log(`Get Started clicked → Admin = ${isAdmin}, isLogged = ${isLogged}`);
  };


  // Use useEffect for side-effects like checking localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setLogged(true);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f172a] to-[#1e293b] text-white">
      {/* Navbar */}
      <nav className="flex justify-between items-center p-6 max-w-6xl mx-auto">
        <h1 className="text-3xl font-extrabold tracking-tight">
          <span className="text-[hsl(200,100%,70%)]">XYLEN</span>
        </h1>
        <div className="space-x-6 hidden sm:flex">
          <a href="#features" className="hover:text-[hsl(200,100%,70%)]">
            Features
          </a>
          <a href="#about" className="hover:text-[hsl(200,100%,70%)]">
            About
          </a>
        </div>
        <button
          onClick={handleStart}
          className="bg-[hsl(200,100%,70%)] px-4 py-2 rounded-xl font-semibold shadow-md hover:scale-105 transition-transform"
        >
          Get Started
        </button>
        {!isLogged ? (
          <button
            onClick={handleSignIn}
            className="bg-[hsl(200,100%,70%)] px-4 py-2 rounded-xl font-semibold shadow-md hover:scale-105 transition-transform"
          >
            Sign In
          </button>
        ) : (
          <button
            onClick={() => {
              localStorage.removeItem("token");
              setLogged(false);
              // After logging out, navigate to home and clear the state
              navigate("/", { state: { isAdmin: false } });
            }}
            className="bg-red-600 px-4 py-2 rounded-xl font-semibold shadow-md hover:scale-105 transition-transform"
          >
            Sign Out
          </button>
        )}
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center py-28 px-6">
        <h2 className="text-5xl sm:text-6xl font-extrabold tracking-tight">
          Smarter{" "}
          <span className="text-[hsl(200,100%,70%)]">Warehouse</span> Management
        </h2>
        <p className="mt-6 text-xl max-w-2xl">
          Manage your warehouse efficiently with tools to track inventory,
          monitor stock, and streamline operations — all in one platform.
        </p>
        <div onClick={handleStart} className="mt-8 flex space-x-4">
          <button className="bg-[hsl(200,100%,70%)] px-6 py-3 rounded-2xl font-bold shadow-lg hover:scale-105 transition-transform">
            Start Now
          </button>
          <button className="border border-[hsl(200,100%,70%)] px-6 py-3 rounded-2xl font-bold hover:bg-[hsl(200,100%,20%)] transition-colors">
            Learn More
          </button>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6 bg-[#1e293b]">
        <h3 className="text-4xl font-bold text-center mb-12">Core Features</h3>
        <div className="grid gap-10 md:grid-cols-3 max-w-6xl mx-auto">
          <div className="p-6 rounded-2xl bg-[#334155] shadow-lg hover:scale-105 transition-transform text-center">
            <Package className="mx-auto mb-4 h-12 w-12 text-[hsl(200,100%,70%)]" />
            <h4 className="text-2xl font-semibold mb-3">Inventory Tracking</h4>
            <p>
              Keep an accurate record of all stock items in your warehouse and
              prevent errors.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#334155] shadow-lg hover:scale-105 transition-transform text-center">
            <Truck className="mx-auto mb-4 h-12 w-12 text-[hsl(200,100%,70%)]" />
            <h4 className="text-2xl font-semibold mb-3">Order Processing</h4>
            <p>
              Track incoming and outgoing goods to ensure smooth warehouse
              operations.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#334155] shadow-lg hover:scale-105 transition-transform text-center">
            <BarChart3 className="mx-auto mb-4 h-12 w-12 text-[hsl(200,100%,70%)]" />
            <h4 className="text-2xl font-semibold mb-3">Reports & Insights</h4>
            <p>
              Generate daily, weekly, or monthly reports to stay on top of stock
              movement.
            </p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-6">
        <h3 className="text-4xl font-bold text-center mb-12">About Us</h3>
        <div className="max-w-4xl mx-auto text-center text-lg space-y-6">
          <p>
            We allow you to easily manage stock levels, process orders, and
            maintain clear visibility of your inventory.
          </p>
          <p>
            Whether you are handling raw materials, finished goods, or both —
            WareFlow ensures accuracy, efficiency, and better control of your
            warehouse.
          </p>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-6 bg-[#1e293b] text-center">
        <h3 className="text-4xl font-bold mb-6">
          Ready to Simplify Your Warehouse?
        </h3>
        <p className="mb-8 text-lg max-w-2xl mx-auto">
          Start using Xylen today and bring order, clarity, and efficiency to
          your warehouse operations.
        </p>
        <button
          onClick={handleStart}
          className="bg-[hsl(200,100%,70%)] px-8 py-4 rounded-2xl font-bold shadow-xl hover:scale-110 transition-transform"
        >
          Get Started
        </button>
      </section>

      {/* Footer */}
      <footer className="py-6 text-center border-t border-gray-700">
        <p>© {new Date().getFullYear()} WareFlow. All rights reserved.</p>
      </footer>
    </div>
  );
}