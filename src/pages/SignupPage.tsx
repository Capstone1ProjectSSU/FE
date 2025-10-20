import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Button from "../components/common/Button";
import Input from "../components/common/Input";

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Signup form:", form);
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black via-[#0b0220] to-[#120030] relative overflow-hidden">
      {/* glowing blurs */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[45rem] h-[45rem] bg-purple-600/20 rounded-full blur-[200px]" />
      <div className="absolute bottom-0 right-0 w-[35rem] h-[35rem] bg-blue-500/20 rounded-full blur-[160px]" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl p-8 text-white"
      >
        <h2 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Create Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Name"
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter your name"
          />
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
            placeholder="Enter password"
          />
          <Button type="submit" variant="primary" className="w-full mt-6 py-4">
            Sign Up
          </Button>
        </form>

        <p className="text-sm text-center text-gray-400 mt-6">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-blue-400 hover:underline cursor-pointer"
          > 
            Login
          </span>
        </p>
      </motion.div>
    </div>
  );
};

export default SignupPage;
