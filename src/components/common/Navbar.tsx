import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faTimes,
  faUser,
  faSignOutAlt,
  faSignInAlt,
  faHome,
  faStar,
  faGuitar,
} from "@fortawesome/free-solid-svg-icons";
import Button from "../common/Button";
import { motion, AnimatePresence } from "framer-motion";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, userEmail, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Scroll listeners
  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      setScrolled(currentY > 80);
      setHidden(currentY > lastScrollY && currentY > 200); // hide when scrolling down past hero
      setLastScrollY(currentY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/");
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }, 300);
    }
    setIsOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsOpen(false);
  };

  return (
    <motion.nav
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
        y: hidden ? -100 : 0,
      }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        scrolled
          ? "bg-black/60 backdrop-blur-lg border-b border-blue-500/20 shadow-md shadow-blue-600/10"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4 text-gray-300">
        {/* Logo */}
        <div
          onClick={() => navigate("/")}
          className="flex items-center space-x-2 text-2xl font-bold text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text cursor-pointer hover:opacity-80 transition"
        >
          <FontAwesomeIcon icon={faGuitar} />
          <span>AI Guitar TAB</span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          <button
            onClick={() => scrollToSection("hero")}
            className="hover:text-blue-400 transition"
          >
            <FontAwesomeIcon icon={faHome} className="mr-2" />
            Home
          </button>
          <button
            onClick={() => scrollToSection("features")}
            className="hover:text-blue-400 transition"
          >
            <FontAwesomeIcon icon={faStar} className="mr-2" />
            Features
          </button>
          <button
            onClick={() => scrollToSection("how-it-works")}
            className="hover:text-blue-400 transition"
          >
            <FontAwesomeIcon icon={faGuitar} className="mr-2" />
            How It Works
          </button>

          {!isAuthenticated ? (
            <>
              <Button
                onClick={() => navigate("/login")}
                variant="ghost"
                className="px-4 py-2 flex items-center"
              >
                <FontAwesomeIcon icon={faSignInAlt} className="mr-2" />
                Login
              </Button>
              <Button
                onClick={() => navigate("/signup")}
                variant="primary"
                className="px-4 py-2 flex items-center"
              >
                <FontAwesomeIcon icon={faUser} className="mr-2" />
                Sign Up
              </Button>
            </>
          ) : (
            <>
              <span className="text-gray-400 text-sm flex items-center">
                <FontAwesomeIcon icon={faUser} className="mr-2 text-blue-400" />
                {userEmail}
              </span>
              <Button
                onClick={() => navigate("/dashboard")}
                variant="outline"
                className="px-4 py-2 flex items-center"
              >
                Dashboard
              </Button>
              <Button
                onClick={handleLogout}
                variant="ghost"
                className="px-4 py-2 flex items-center"
              >
                <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                Logout
              </Button>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-gray-300 hover:text-blue-400 transition"
        >
          <FontAwesomeIcon icon={isOpen ? faTimes : faBars} size="lg" />
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="md:hidden flex flex-col items-center bg-black/40 backdrop-blur-md border-t border-white/0 py-6 space-y-5 text-gray-200"
          >
            <button onClick={() => scrollToSection("hero")} className="hover:text-blue-400">
              <FontAwesomeIcon icon={faHome} className="mr-2" /> Home
            </button>
            <button onClick={() => scrollToSection("features")} className="hover:text-blue-400">
              <FontAwesomeIcon icon={faStar} className="mr-2" /> Features
            </button>
            <button onClick={() => scrollToSection("how-it-works")} className="hover:text-blue-400">
              <FontAwesomeIcon icon={faGuitar} className="mr-2" /> How It Works
            </button>

            {!isAuthenticated ? (
              <>
                <Button onClick={() => navigate("/login")} variant="ghost" className="px-2 py-1">
                  <FontAwesomeIcon icon={faSignInAlt} className="mr-2" />
                  Login
                </Button>
                <Button onClick={() => navigate("/signup")} variant="primary" className="flex items-center px-2 py-1">
                  <FontAwesomeIcon icon={faUser} className="mr-2" />
                  Sign Up
                </Button>
              </>
            ) : (
              <>
                <span className="text-gray-200 text-sm flex items-center">
                  <FontAwesomeIcon icon={faUser} className="mr-2 text-blue-400" />
                  {userEmail}
                </span>
                <Button onClick={() => navigate("/dashboard")} variant="outline" className="px-4 py-2">
                  Dashboard
                </Button>
                <Button onClick={handleLogout} variant="ghost" className="px-4 py-2">
                  <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                  Logout
                </Button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
