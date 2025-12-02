import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMusic, faFolderOpen, faPeopleGroup } from "@fortawesome/free-solid-svg-icons";
import { motion, AnimatePresence } from "framer-motion";
import TranscribePanel from "../components/features/transcribe/TranscribePanel";
import MyTabsPanel from "../components/features/tabs/MyTabsPanel";
import TabDetailPanel from "../components/features/tabs/TabDetailPanel";
import TranscribeStatusList from "../components/features/transcribe/TranscripbeStatusList";
import CommunityPanel from "../components/features/community/CommunityPanel";
import CommunityDetailPanel from "../components/features/community/CommunityDetailPanel";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("transcribe");
  const [selectedTab, setSelectedTab] = useState<any | null>(null);
  const [selectedCommunityTab, setSelectedCommunityTab] = useState<any | null>(null);
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
          />
        </motion.div>
      ) : selectedCommunityTab ? (
        <motion.div
          key="community-detail"
          initial={{ x: 80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -80, opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <CommunityDetailPanel
            tab={selectedCommunityTab}
            onBack={() => setSelectedCommunityTab(null)}
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
          {activeTab === "community" && (
            <CommunityPanel onSelectTab={setSelectedCommunityTab} />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );


  return (
    <div className="min-h-screen flex bg-gradient-to-b from-black via-[#0b0220] to-[#120030] text-white relative overflow-hidden pt-[60px]">
      <div className="fixed inset-0 -z-10">
        <div className="absolute -top-60 -left-60 w-[70rem] h-[70rem] bg-blue-500/15 rounded-full blur-[220px]" />
        <div className="absolute bottom-[-20rem] right-[-20rem] w-[70rem] h-[70rem] bg-purple-600/20 rounded-full blur-[240px]" />
      </div>

      <motion.aside
        layout
        className="relative z-10 w-64 flex flex-col py-10 px-6 border-r border-white/10 bg-white/5 backdrop-blur-lg"
      >
        <motion.div layout className="flex flex-col space-y-2">
          <motion.button
            layout
            onClick={() => {
              setActiveTab("transcribe");
              setSelectedTab(null);
              setPreviewTab(null);
              setSelectedCommunityTab(null);
            }}
            whileTap={{ scale: 0.97 }}
            whileHover={{ x: 4 }}
            className={`relative flex items-center space-x-3 py-3 rounded-xl font-medium transition-all duration-300 ${activeTab === "transcribe"
                ? "text-white font-semibold"
                : "text-gray-400 hover:text-white"
              }`}
          >
            <FontAwesomeIcon
              icon={faMusic}
              className={`w-5 h-5 ${activeTab === "transcribe" ? "text-blue-400" : "text-gray-500"
                }`}
            />
            <span>Transcribe</span>
          </motion.button>

          <motion.button
            layout
            onClick={() => {
              setActiveTab("mytabs");
              setSelectedTab(null);
              setPreviewTab(null);
              setSelectedCommunityTab(null);
            }}
            whileTap={{ scale: 0.97 }}
            whileHover={{ x: 4 }}
            className={`relative flex items-center space-x-3 py-3 rounded-xl font-medium transition-all duration-300 ${activeTab === "mytabs"
                ? "text-white font-semibold"
                : "text-gray-400 hover:text-white"
              }`}
          >
            <FontAwesomeIcon
              icon={faFolderOpen}
              className={`w-5 h-5 ${activeTab === "mytabs" ? "text-blue-400" : "text-gray-500"
                }`}
            />
            <span>My TABs</span>
          </motion.button>

          <AnimatePresence>
            {activeTab === "mytabs" && (
              <motion.div
                key="mytab-filters"
                layout
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4 }}
                className="ml-2 mt-2 space-y-6 text-sm"
              >
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
                          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 ${active
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
                          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 ${active
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
          </AnimatePresence>

          <motion.button
            layout
            onClick={() => {
              setActiveTab("community");
              setSelectedTab(null);
              setPreviewTab(null);
              setSelectedCommunityTab(null);
            }}
            whileTap={{ scale: 0.97 }}
            whileHover={{ x: 4 }}
            transition={{ duration: 0.2 }}
            className={`relative flex items-center space-x-3 py-3 rounded-xl font-medium transition-all duration-300 ${activeTab === "community"
                ? "text-white font-semibold"
                : "text-gray-400 hover:text-white"
              }`}
          >
            <FontAwesomeIcon
              icon={faPeopleGroup}
              className={`w-5 h-5 ${activeTab === "community" ? "text-blue-400" : "text-gray-500"
                }`}
            />
            <span>Community</span>
          </motion.button>
        </motion.div>

        <AnimatePresence>
          {activeTab === "community" && (
            <motion.div
              key="community-filters"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="mt-5 space-y-5 text-sm px-2"
            >
              <h4 className="font-semibold text-gray-300 mb-2">Sort by</h4>
              <div className="flex flex-wrap gap-2">
                {["Latest", "Oldest", "Highest Rated", "Lowest Rated"].map((sort) => (
                  <button
                    key={sort}
                    onClick={() => console.log(`Sort by: ${sort}`)}
                    className="px-3 py-1.5 rounded-full text-xs font-medium border border-white/10 text-gray-400 hover:text-white hover:border-white/20 transition-all"
                  >
                    {sort}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <TranscribeStatusList onPreview={(item) => setPreviewTab(item)} />
      </motion.aside>
      <main className="flex-1 flex justify-center items-start p-10 relative z-10 overflow-y-auto bg-[#0b001e]/60 backdrop-blur-sm border-l border-white/5">
        <div className="max-w-6xl mx-auto w-full text-gray-100">{renderPanel()}</div>
      </main>
    </div>
  );
}
