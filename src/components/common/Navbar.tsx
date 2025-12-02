import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faTimes,
  faUser,
  faSignOutAlt,
  faSignInAlt,
  faGuitar,
  faGear,
  faTableList,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";

import Button from "../common/Button";
import { motion, AnimatePresence } from "framer-motion";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, userEmail, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  const isDashboard = location.pathname.startsWith("/dashboard");

  // Scroll listener
  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      setScrolled(currentY > 80);
      setHidden(currentY > lastScrollY && currentY > 200);
      setLastScrollY(currentY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

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
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${isDashboard
        ? "bg-[#090014]/95 backdrop-blur-xl border-b border-blue-500/20 shadow-md shadow-blue-600/10"
        : scrolled
          ? "bg-black/60 backdrop-blur-lg border-b border-blue-500/20 shadow-md shadow-blue-600/10"
          : "bg-transparent border-b border-transparent"
        }`}
    >
      {/* Sidebar 연결 블록 (대시보드 전용) */}
      {isDashboard && (
        <div className="absolute left-0 top-0 h-full w-64 bg-white/5 backdrop-blur-lg border-r border-white/10" />
      )}

      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4 text-gray-300 relative z-10">
        {/* Logo */}
        <div
          onClick={() => navigate("/")}
          className="flex items-center space-x-2 text-2xl font-bold text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text cursor-pointer hover:opacity-80 transition"
        >
          <FontAwesomeIcon icon={faGuitar} />
          <span>AI Guitar TAB</span>
        </div>

        {/* ✅ Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
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
              {/* ✅ Dashboard 이동 버튼 (프로필 왼쪽) */}
              <button
                onClick={() => navigate("/dashboard")}
                className="text-sm text-gray-300 hover:text-blue-400 transition flex items-center space-x-2"
              >
                <FontAwesomeIcon icon={faTableList} className="text-blue-400" />
                <span>Dashboard</span>
              </button>

              {/* ✅ 프로필 드롭다운 */}
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center space-x-2 text-sm hover:text-blue-400 transition"
                >
                  <FontAwesomeIcon icon={faUser} className="text-blue-400" />
                  <span>{userEmail}</span>
                  <motion.span
                    animate={{ rotate: dropdownOpen ? 180 : 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className="ml-1 text-xs text-gray-400"
                  >
                    <FontAwesomeIcon icon={faChevronDown} />
                  </motion.span>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white/10 backdrop-blur-lg border border-white/10 rounded-lg shadow-lg z-50 text-gray-200">
                    <button
                      onClick={() => {
                        navigate("/settings");
                        setDropdownOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 hover:bg-white/20 transition"
                    >
                      <FontAwesomeIcon icon={faGear} className="mr-2" /> Settings
                    </button>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-red-400 hover:bg-red-500/20 transition"
                    >
                      <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" /> Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* ✅ 모바일 메뉴 토글 */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-gray-300 hover:text-blue-400 transition"
        >
          <FontAwesomeIcon icon={isOpen ? faTimes : faBars} size="lg" />
        </button>
      </div>

      {/* ✅ Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="md:hidden flex flex-col items-center bg-black/20 backdrop-blur-md border-t border-white/0 py-6 space-y-5 text-gray-200"
          >
            {!isAuthenticated ? (
              <>
                <Button
                  onClick={() => navigate("/login")}
                  variant="ghost"
                  className="px-2 py-1"
                >
                  <FontAwesomeIcon icon={faSignInAlt} className="mr-2" />
                  Login
                </Button>
                <Button
                  onClick={() => navigate("/signup")}
                  variant="primary"
                  className="flex items-center px-2 py-1"
                >
                  <FontAwesomeIcon icon={faUser} className="mr-2" />
                  Sign Up
                </Button>
              </>
            ) : (
              <>
                {/* 모바일에서도 Dashboard 표시 */}
                <Button
                  onClick={() => {
                    navigate("/dashboard");
                    setIsOpen(false);
                  }}
                  variant="outline"
                  className="px-4 py-2 w-40 flex justify-center items-center"
                >
                  <FontAwesomeIcon icon={faTableList} className="mr-2" /> Dashboard
                </Button>

                <Button
                  onClick={() => {
                    navigate("/settings");
                    setIsOpen(false);
                  }}
                  variant="primary"
                  className="px-4 py-2 w-40 flex justify-center items-center bg-transparent"
                >
                  <FontAwesomeIcon icon={faGear} className="mr-2" /> Settings
                </Button>

                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  className="px-4 py-2 w-40 flex justify-center items-center"
                >
                  <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" /> Logout
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
