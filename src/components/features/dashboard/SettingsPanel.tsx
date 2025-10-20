import React, { useState } from "react";
import { motion } from "framer-motion";
import Button from "../../common/Button";
import Input from "../../common/Input";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear } from "@fortawesome/free-solid-svg-icons";

const SettingsPanel: React.FC = () => {
  const [form, setForm] = useState({ username: "", notifications: true });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, checked, value } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSave = () => {
    alert("Settings saved! (mock)");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-md mx-auto text-gray-100 space-y-6"
    >
      <div className="flex items-center justify-center gap-3 mb-4">
        <FontAwesomeIcon icon={faGear} className="text-blue-400 text-2xl" />
        <h2 className="text-2xl font-semibold">User Settings</h2>
      </div>

      <Input
        label="Username"
        name="username"
        type="text"
        value={form.username}
        onChange={handleChange}
        placeholder="Enter your username"
      />

      <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-md border border-white/10 rounded-xl p-4">
        <input
          id="notifications"
          type="checkbox"
          name="notifications"
          checked={form.notifications}
          onChange={handleChange}
          className="w-5 h-5 accent-blue-500 cursor-pointer"
        />
        <label htmlFor="notifications" className="text-gray-300 cursor-pointer">
          Enable notifications
        </label>
      </div>

      <Button onClick={handleSave} variant="primary" className="w-full py-3">
        Save Settings
      </Button>
    </motion.div>
  );
};

export default SettingsPanel;
