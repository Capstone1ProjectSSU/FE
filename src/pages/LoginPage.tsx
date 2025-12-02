import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import { useAuth } from "../contexts/AuthContext";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.email && form.password) {
      login(form.email);
      navigate("/dashboard");
    } else {
      alert("Please enter email and password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black via-[#0b0220] to-[#120030] relative overflow-hidden">
      {/* glowing blurs */}
      <div className="absolute -top-40 -left-40 w-[40rem] h-[40rem] bg-blue-500/20 rounded-full blur-[180px]" />
      <div className="absolute bottom-0 right-0 w-[35rem] h-[35rem] bg-purple-600/20 rounded-full blur-[160px]" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl p-8 text-white"
      >
        <h2 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Welcome Back
        </h2>

        <form onSubmit={handleLogin} className="space-y-6">
          <Input
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Enter your email"
          />
          <Input
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Enter your password"
          />
          <Button type="submit" variant="primary" className="w-full mt-6 py-3">
            Login
          </Button>
        </form>

        <p className="text-sm text-center text-gray-400 mt-6">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="text-blue-400 hover:underline cursor-pointer"
          >
            Sign Up
          </span>
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;
