import React, { useState } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

export interface InputProps {
  label?: string;
  name: string;
  type?: string;
  value: string;
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input: React.FC<InputProps> = ({
  label,
  name,
  type = "text",
  value,
  placeholder,
  onChange,
}) => {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const isPasswordField = type === "password";

  return (
    <div className="flex flex-col space-y-2 w-full relative">
      {label && (
        <label
          htmlFor={name}
          className="text-sm font-medium text-gray-300 tracking-wide"
        >
          {label}
        </label>
      )}

      <div className="relative">
        <motion.input
          id={name}
          name={name}
          type={isPasswordField && showPassword ? "text" : type}
          value={value}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChange={onChange}
          placeholder={placeholder}
          whileHover={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 250, damping: 18 }}
          className={`w-full text-white bg-white/10 backdrop-blur-md border rounded-xl px-4 py-3 pr-11 outline-none transition-all duration-300 placeholder-gray-500
            ${
              focused
                ? "border-blue-500/60 shadow-[0_0_10px_rgba(59,130,246,0.3)]"
                : "border-white/10"
            }`}
        />

        {/* Password visibility toggle */}
        {isPasswordField && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-400 transition-colors"
          >
            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
          </button>
        )}
      </div>
    </div>
  );
};

export default Input;
