import { motion } from "framer-motion";
import { useCommunity } from "../../../contexts/CommunityContext";
import CommunityCard from "./CommunityCard";
import type { TabItem } from "../../../types/tab";

interface CommunityPanelProps {
  onSelectTab: (tab: TabItem) => void; // ✅ props 타입 명시
}

export default function CommunityPanel({ onSelectTab }: CommunityPanelProps) {
  const { sharedTabs } = useCommunity();

  if (sharedTabs.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center text-gray-400 py-20 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-lg"
      >
        <p className="text-lg font-medium">아직 공유된 악보가 없습니다 🎶</p>
        <p className="text-sm mt-2 text-gray-500">
          My Tabs에서 <span className="text-blue-400 font-semibold">Share</span> 버튼을 눌러보세요!
        </p>
      </motion.div>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center text-center space-y-8 text-white mb-4"
      >
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
        >
          Community
        </motion.h2>

        <p className="text-gray-400 max-w-xl">
          Upload your MP3, choose your instrument and difficulty,
          and watch progress in both the panel and sidebar.
        </p>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
      >
        {sharedTabs.map((tab) => (
          <CommunityCard key={tab.id} tab={tab} onSelect={() => onSelectTab(tab)} />
        ))}
      </motion.div>
    </>
  );
}
