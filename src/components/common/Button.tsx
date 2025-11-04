import React from "react";
import { motion } from "framer-motion";

export interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "outline" | "ghost";
  className?: string;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  type = "button",
  variant = "primary",
  className = "",
  disabled = false,
}) => {
  const baseStyles =
    "flex items-center justify-center gap-2 px-5 py-2 rounded-lg font-medium text-sm transition-all duration-300 focus:outline-none";

  const variants = {
    primary:
      "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-500 hover:to-purple-500 shadow-md shadow-blue-500/20 hover:shadow-blue-500/40",
    outline:
      "border border-white/20 text-gray-300 hover:text-white hover:border-blue-400 bg-white/5 backdrop-blur-lg",
    ghost:
      "text-gray-400 hover:text-white hover:bg-white/10",
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={!disabled ? { scale: 1.03 } : {}}
      whileTap={!disabled ? { scale: 0.97 } : {}}
      className={`${baseStyles} ${variants[variant]} ${disabled ? "opacity-50 cursor-not-allowed" : ""
        } ${className}`}
    >
      {children}
    </motion.button>
  );
};

export default Button;
