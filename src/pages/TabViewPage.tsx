import { useLocation, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface LocationState {
  instrument?: "electric" | "bass";
  difficulty?: "Beginner" | "Intermediate" | "Advanced";
}

export default function TabViewPage() {
  const { id } = useParams();
  const location = useLocation();
  const state = location.state as LocationState;

  const [instrument, setInstrument] = useState<"electric" | "bass">(
    state?.instrument || "electric"
  );
  const [difficulty, setDifficulty] = useState<"Beginner" | "Intermediate" | "Advanced">(
    state?.difficulty || "Intermediate"
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const renderTab = () => {
    if (instrument === "electric") {
      switch (difficulty) {
        case "Beginner":
          return `e|---0---0---0---|\nB|---1---1---1---|`;
        case "Intermediate":
          return `e|---0---2---3---|\nB|---1---3---0---|`;
        case "Advanced":
          return `e|---7---8---10--|\nB|---8---10--12--|`;
      }
    } else {
      switch (difficulty) {
        case "Beginner":
          return `G|----------------|\nD|---2---2---2----|\nA|---3---3---3----|\nE|----------------|`;
        case "Intermediate":
          return `G|----------------|\nD|---5---7---5----|\nA|---3---5---3----|\nE|----------------|`;
        case "Advanced":
          return `G|---9---10--12---|\nD|---7---9---10---|\nA|---5---7---8----|\nE|----------------|`;
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gradient-to-b from-black via-[#0b0220] to-[#120030] text-white relative overflow-hidden px-6 py-24">
      {/* Background glow effects */}
      <div className="absolute -top-40 -left-40 w-[60rem] h-[60rem] bg-blue-500/20 rounded-full blur-[200px]" />
      <div className="absolute bottom-0 right-0 w-[50rem] h-[50rem] bg-purple-600/20 rounded-full blur-[180px]" />

      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-5xl md:text-6xl font-extrabold text-center mb-10 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
      >
        🎼 Generated TAB #{id}
      </motion.h1>

      {/* Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.3 }}
        className="flex flex-col sm:flex-row sm:space-x-8 space-y-4 sm:space-y-0 mb-10 bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl p-6 shadow-lg"
      >
        <div className="flex flex-col sm:flex-row sm:items-center">
          <label className="text-sm font-medium text-gray-300 mb-2 sm:mb-0 sm:mr-3">
            Instrument:
          </label>
          <select
            value={instrument}
            onChange={(e) => setInstrument(e.target.value as "electric" | "bass")}
            className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-500 transition-all"
          >
            <option value="electric">🎸 Electric Guitar</option>
            <option value="bass">🎵 Bass</option>
          </select>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center">
          <label className="text-sm font-medium text-gray-300 mb-2 sm:mb-0 sm:mr-3">
            Difficulty:
          </label>
          <select
            value={difficulty}
            onChange={(e) =>
              setDifficulty(e.target.value as "Beginner" | "Intermediate" | "Advanced")
            }
            className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-500 transition-all"
          >
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>
      </motion.div>

      {/* TAB Display */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="w-full max-w-3xl bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-8 font-mono text-lg leading-7 text-blue-100 shadow-lg whitespace-pre-wrap text-center"
      >
        {renderTab()}
      </motion.div>
    </div>
  );
}
