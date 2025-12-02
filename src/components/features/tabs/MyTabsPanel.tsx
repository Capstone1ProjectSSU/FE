import { useEffect, useState } from "react";
import TabList from "./TabList";
import { motion } from "framer-motion";

interface MyTabsPanelProps {
  filters: any;
  onSelectTab?: (tab: any) => void;
}

export default function MyTabsPanel({ filters, onSelectTab }: MyTabsPanelProps) {
  const [allTabs, setAllTabs] = useState<any[]>([]);
  const [filteredTabs, setFilteredTabs] = useState<any[]>([]);

  useEffect(() => {
    const data = localStorage.getItem("myTabs");
    const parsed = data ? JSON.parse(data) : [];
    setAllTabs(parsed);
  }, []);

  useEffect(() => {
    const filtered = allTabs.filter((tab: any) => {
      const instrumentMatch =
        (tab.instrument.includes("Electric") && filters.instrument.electric) ||
        (tab.instrument.includes("Bass") && filters.instrument.bass);

      const difficultyMatch = filters.difficulty[tab.difficulty];

      return instrumentMatch && difficultyMatch;
    });
    setFilteredTabs(filtered);
  }, [filters, allTabs]);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center text-center space-y-8 text-white mb-4"
      >
        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
        >
          My Tabs
        </motion.h2>

        <p className="text-gray-400 max-w-xl">
          Upload your MP3, choose your instrument and difficulty,
          and watch progress in both the panel and sidebar.
        </p>
      </motion.div>
      <TabList
        tabs={filteredTabs}
        onSelectTab={onSelectTab}
        onDelete={(id) => {
          setAllTabs((prev) => prev.filter((t) => t.id !== id));
          setFilteredTabs((prev) => prev.filter((t) => t.id !== id));
        }}
      />
    </>
  );
}
