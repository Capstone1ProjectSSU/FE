import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMusic, faFolderOpen } from "@fortawesome/free-solid-svg-icons";
import { motion, AnimatePresence } from "framer-motion";
import TranscribePanel from "../components/features/dashboard/TranscribePanel";
import MyTabsPanel from "../components/features/dashboard/MyTabsPanel";
import TabDetailPanel from "../components/features/dashboard/TabDetailPanel";
import TranscribeStatusList from "../components/features/dashboard/TranscripbeStatusList";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("transcribe");
  const [selectedTab, setSelectedTab] = useState<any | null>(null); // ✅ 상세보기용 상태
  const [previewTab, setPreviewTab] = useState<any | null>(null);

  const [filters, setFilters] = useState({
    instrument: { electric: true, bass: true },
    difficulty: { Beginner: true, Intermediate: true, Advanced: true },
  });

  const toggleInstrument = (key: "electric" | "bass") =>
    setFilters((prev) => ({
      ...prev,
      instrument: { ...prev.instrument, [key]: !prev.instrument[key] },
    }));

  const toggleDifficulty = (key: "Beginner" | "Intermediate" | "Advanced") =>
    setFilters((prev) => ({
      ...prev,
      difficulty: { ...prev.difficulty, [key]: !prev.difficulty[key] },
    }));

  const tabs = [
    { id: "transcribe", icon: faMusic, label: "Transcribe" },
    { id: "mytabs", icon: faFolderOpen, label: "My TABs" },
  ];

  const renderPanel = () => (
    <AnimatePresence mode="wait">
      {previewTab ? (
        <motion.div
          key="tab-preview"
          initial={{ x: 80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -80, opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <TabDetailPanel
            tab={previewTab}
            onBack={() => setPreviewTab(null)}
            mode="preview"
          />
        </motion.div>
      ) : selectedTab ? (
        <motion.div
          key="tab-detail"
          initial={{ x: 80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -80, opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <TabDetailPanel 
          tab={selectedTab} 
          onBack={() => setSelectedTab(null)} 
          mode="mytab"
          />
        </motion.div>
      ) : (
        <motion.div
          key={activeTab}
          initial={{ x: -80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 80, opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          {activeTab === "transcribe" && <TranscribePanel />}
          {activeTab === "mytabs" && (
            <MyTabsPanel filters={filters} onSelectTab={setSelectedTab} />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );


  return (
    <div className="min-h-screen flex bg-gradient-to-b from-black via-[#0b0220] to-[#120030] text-white relative overflow-hidden pt-[60px]">
      {/* Background glow */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute -top-60 -left-60 w-[70rem] h-[70rem] bg-blue-500/15 rounded-full blur-[220px]" />
        <div className="absolute bottom-[-20rem] right-[-20rem] w-[70rem] h-[70rem] bg-purple-600/20 rounded-full blur-[240px]" />
      </div>

      {/* Sidebar */}
      <aside className="relative z-10 w-64 flex flex-col py-10 px-6 border-r border-white/10 bg-white/5 backdrop-blur-lg">
        {/* Nav */}
        <nav className="flex flex-col space-y-2">
          {tabs.map((t) => {
            const isActive = activeTab === t.id;
            return (
              <motion.button
                key={t.id}
                onClick={() => {
                  setActiveTab(t.id);
                  setSelectedTab(null);
                  setPreviewTab(null);
                }}
                whileTap={{ scale: 0.97 }}
                whileHover={{ x: 4 }}
                transition={{ duration: 0.2 }}
                className={`relative flex items-center space-x-3 py-3 rounded-xl font-medium transition-all duration-300
                  ${isActive
                    ? "text-white font-semibold"
                    : "text-gray-400 hover:text-white"
                  }`}
              >
                <FontAwesomeIcon
                  icon={t.icon}
                  className={`w-5 h-5 transition-colors duration-300 ${isActive ? "text-blue-400" : "text-gray-500 group-hover:text-white"
                    }`}
                />
                <span>{t.label}</span>
              </motion.button>
            );
          })}
        </nav>

        {/* MyTabs 전용 필터 (MyTabs 탭일 때만) */}
        {activeTab === "mytabs" && !selectedTab && !previewTab && (
          <motion.div
            key="filters"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="mt-5 space-y-8 text-sm px-2"
          >
            {/* Instrument */}
            <div>
              <h4 className="font-semibold text-gray-300 mb-3">Instrument</h4>
              <div className="flex flex-wrap gap-2">
                {[
                  { key: "electric", label: "Electric Guitar" },
                  { key: "bass", label: "Bass Guitar" },
                ].map((inst) => {
                  const active = filters.instrument[inst.key as "electric" | "bass"];
                  return (
                    <button
                      key={inst.key}
                      onClick={() => toggleInstrument(inst.key as any)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200
                        ${active
                          ? "border-blue-500/60 text-blue-300"
                          : "border-white/10 text-gray-400 hover:text-white hover:border-white/20"
                        }`}
                    >
                      {inst.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Difficulty */}
            <div>
              <h4 className="font-semibold text-gray-300 mb-3">Difficulty</h4>
              <div className="flex flex-wrap gap-2">
                {["Beginner", "Intermediate", "Advanced"].map((level) => {
                  const active =
                    filters.difficulty[level as keyof typeof filters.difficulty];
                  const colorMap: Record<string, string> = {
                    Beginner: "text-green-300 border-green-500/60",
                    Intermediate: "text-blue-300 border-blue-500/60",
                    Advanced: "text-purple-300 border-purple-500/60",
                  };
                  return (
                    <button
                      key={level}
                      onClick={() => toggleDifficulty(level as any)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200
                        ${active
                          ? `${colorMap[level]}`
                          : "border-white/10 text-gray-400 hover:text-white hover:border-white/20"
                        }`}
                    >
                      {level}
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {/* Transcription Progress Cards */}
        <TranscribeStatusList onPreview={(item) => setPreviewTab(item)} />
      </aside>

      {/* Main */}
      <main className="flex-1 flex justify-center items-start p-10 relative z-10 overflow-y-auto bg-[#0b001e]/60 backdrop-blur-sm border-l border-white/5">
        <div className="max-w-6xl mx-auto w-full text-gray-100">{renderPanel()}</div>
      </main>
    </div>
  );
}
