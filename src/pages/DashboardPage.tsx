import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMusic, faFolderOpen, faPeopleGroup } from "@fortawesome/free-solid-svg-icons";
import { motion, AnimatePresence } from "framer-motion";
import TranscribePanel from "../components/features/transcribe/TranscribePanel";
import MySheetsPanel from "../components/sheets/MySheetsPanel";
import type { SheetBase } from "../types/sheet";
import SheetDetailPanel from "../components/sheets/SheetDetailPanel";
import TranscribeStatusList from "../components/features/transcribe/TranscribeStatusList";
import CommunityPanel from "../components/features/community/CommunityPanel";
import CommunityDetailPanel from "../components/features/community/CommunityDetailPanel";
import type { SheetFilters } from "../types/filter";

type InstrumentFilterKey = "GUITAR" | "BASS" | "UKULELE";
type DifficultyFilterKey = "EASY" | "NORMAL" | "HARD";

const instrumentFilters: { key: InstrumentFilterKey; label: string }[] = [
  { key: "GUITAR", label: "Electric Guitar" },
  { key: "BASS", label: "Bass Guitar" },
  { key: "UKULELE", label: "Ukulele" },
];

const difficultyFilters: { key: DifficultyFilterKey; label: string, color: string }[] = [
  { key: "EASY", label: "Beginner", color: "text-green-300 border-green-500/60" },
  { key: "NORMAL", label: "Intermediate", color: "text-blue-300 border-blue-500/60" },
  { key: "HARD", label: "Advanced", color: "text-purple-300 border-purple-500/60" },
];
export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("transcribe");
  const [selectedTab, setSelectedTab] = useState<SheetBase | null>(null);
  const [selectedCommunityTab, setSelectedCommunityTab] = useState<any | null>(null);
  const [previewTab, setPreviewTab] = useState<any | null>(null);

  const [filters, setFilters] = useState<SheetFilters>({
    instrument: { GUITAR: true, BASS: true, UKULELE: true },
    difficulty: { EASY: true, NORMAL: true, HARD: true },
  });


  const toggleInstrument = (key: "GUITAR" | "BASS" | "UKULELE") =>
    setFilters((prev) => ({
      ...prev,
      instrument: { ...prev.instrument, [key]: !prev.instrument[key] },
    }));

  const toggleDifficulty = (key: "EASY" | "NORMAL" | "HARD") =>
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
          <SheetDetailPanel
            sheet={previewTab}
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
          <SheetDetailPanel
            sheet={selectedTab}
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
            <MySheetsPanel filters={filters} onSelectTab={setSelectedTab} />
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
                  <h4 className="font-semibold text-gray-300 mb-3 flex items-center justify-between">
                    Instrument
                    <button
                      onClick={() =>
                        setFilters((prev) => ({
                          ...prev,
                          instrument: { GUITAR: true, BASS: true, UKULELE: true },
                        }))
                      }
                      className="text-xs px-2 py-1 rounded-md border border-white/20 text-gray-400 hover:text-white hover:border-white/40 transition-all"
                    >
                      Reset
                    </button>
                  </h4>

                  <div className="flex flex-wrap gap-2">
                    {instrumentFilters.map((inst) => {
                      const active = filters.instrument[inst.key];

                      return (
                        <button
                          key={inst.key}
                          onClick={() => toggleInstrument(inst.key)}
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
                  <h4 className="font-semibold text-gray-300 mb-3 flex items-center justify-between">
                    Difficulty
                    <button
                      onClick={() =>
                        setFilters((prev) => ({
                          ...prev,
                          difficulty: { EASY: true, NORMAL: true, HARD: true },
                        }))
                      }
                      className="text-xs px-2 py-1 rounded-md border border-white/20 text-gray-400 hover:text-white hover:border-white/40 transition-all"
                    >
                      Reset
                    </button>
                  </h4>

                  <div className="flex flex-wrap gap-2">
                    {difficultyFilters.map((diff) => {
                      const active = filters.difficulty[diff.key];

                      return (
                        <motion.button
                          key={diff.key}
                          whileTap={{ scale: 0.95 }}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${active
                            ? `${diff.color} bg-white/[0.15] shadow-md`
                            : "border-white/10 text-gray-400 hover:text-white hover:border-white/20"
                            }`}
                          onClick={() => toggleDifficulty(diff.key)}
                        >
                          {diff.label}
                        </motion.button>
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

        <TranscribeStatusList
          onPreview={(job) =>
            setPreviewTab({
              isPreview: true,
              musicId: null,
              title: job.songTitle,
              artist: job.artistName,
              instrument: job.instrument,
              difficulty: "NORMAL",
              sheetDataUrl: job.sheetDataUrl
            })
          }
        />
      </motion.aside>
      <main className="flex-1 flex justify-center items-start p-10 relative z-10 overflow-y-auto bg-[#0b001e]/60 backdrop-blur-sm border-l border-white/5">
        <div className="max-w-6xl mx-auto w-full text-gray-100">{renderPanel()}</div>
      </main>
    </div>
  );
}
