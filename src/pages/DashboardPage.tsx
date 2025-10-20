import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMusic, faFolderOpen, faGear } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import TranscribePanel from "../components/features/dashboard/TranscribePanel";
import MyTabsPanel from "../components/features/dashboard/MyTabsPanel";
import SettingsPanel from "../components/features/dashboard/SettingsPanel";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("transcribe");

  const tabs = [
    { id: "transcribe", icon: faMusic, label: "Transcribe" },
    { id: "mytabs", icon: faFolderOpen, label: "My TABs" },
    { id: "settings", icon: faGear, label: "Settings" },
  ];

  const renderPanel = () => {
    switch (activeTab) {
      case "transcribe":
        return <TranscribePanel />;
      case "mytabs":
        return <MyTabsPanel />;
      case "settings":
        return <SettingsPanel />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-black via-[#0b0220] to-[#120030] text-white relative overflow-hidden px-6 py-24">
      {/* Background glow effects */}
      <div className="absolute -top-40 -left-40 w-[60rem] h-[60rem] bg-blue-500/20 rounded-full blur-[200px]" />
      <div className="absolute bottom-0 right-0 w-[50rem] h-[50rem] bg-purple-600/20 rounded-full blur-[180px]" />

      {/* Header */}
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-5xl font-extrabold text-center mb-10 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent drop-shadow-lg"
      >
        🎸 Dashboard
      </motion.h1>

      {/* Tab Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.3 }}
        className="flex justify-center space-x-4 mb-10"
      >
        {tabs.map((t) => (
          <motion.button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className={`flex items-center space-x-2 px-6 py-3 rounded-full font-medium transition-all duration-300 backdrop-blur-md border
              ${
                activeTab === t.id
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white border-transparent shadow-[0_0_15px_rgba(99,102,241,0.4)]"
                  : "bg-white/10 border-white/10 text-gray-300 hover:border-blue-400 hover:text-white"
              }`}
          >
            <FontAwesomeIcon icon={t.icon} />
            <span>{t.label}</span>
          </motion.button>
        ))}
      </motion.div>

      {/* Content Panel */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl shadow-lg p-8 max-w-6xl mx-auto w-full text-gray-100"
      >
        {renderPanel()}
      </motion.div>
    </div>
  );
}
