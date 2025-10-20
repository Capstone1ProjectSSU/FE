import { motion } from "framer-motion";
import TabList from "../tabs/TabList";

export default function MyTabsPanel() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-6 text-white text-center"
    >
      <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
        🎵 My Saved TABs
      </h2>
      <p className="text-gray-400 max-w-2xl mx-auto">
        View, download, or delete your generated TABs.  
        Each one is saved securely in your personal dashboard.
      </p>
      <TabList />
    </motion.div>
  );
}
