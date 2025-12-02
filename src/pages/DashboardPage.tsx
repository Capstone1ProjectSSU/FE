import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMusic,
  faFolderOpen,
  faPeopleGroup,
} from "@fortawesome/free-solid-svg-icons";

import TranscribePanel from "../components/features/transcribe/TranscribePanel";
import TranscribeStatusList from "../components/features/transcribe/TranscribeStatusList";

import MySheetsPanel from "../components/features/sheets/MySheetsPanel";
import SheetDetailPanel from "../components/features/sheets/SheetDetailPanel";

import PostPanel from "../components/features/posts/PostPanel";
import PostDetailPanel from "../components/features/posts/PostDetailPanel";

import type { SheetListItem } from "../types/sheet";
import type { SheetFilters } from "../types/filter";
import type { PostListItem } from "../types/post";
import type { PostFilters, PostSortKey } from "../types/filter";

const instrumentFilters = [
  { key: "GUITAR" as const, label: "Electric Guitar" },
  { key: "BASS" as const, label: "Bass Guitar" },
];

const difficultyFilters = [
  {
    key: "EASY" as const,
    label: "Beginner",
    color: "text-green-300 border-green-500/60",
  },
  {
    key: "NORMAL" as const,
    label: "Intermediate",
    color: "text-blue-300 border-blue-500/60",
  },
  {
    key: "HARD" as const,
    label: "Advanced",
    color: "text-purple-300 border-purple-500/60",
  },
];

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<"transcribe" | "mytabs" | "community">(
    "transcribe"
  );

  const [selectedSheet, setSelectedSheet] = useState<SheetListItem | null>(null);
  const [previewTab, setPreviewTab] = useState<any | null>(null);
  const [selectedCommunityTab, setSelectedCommunityTab] = useState<PostListItem | null>(null);
  const [refreshMySheets, setRefreshMySheets] = useState<(() => void) | null>(null);

  const [filters, setFilters] = useState<SheetFilters>({
    instrument: { GUITAR: true, BASS: true },
    difficulty: { EASY: true, NORMAL: true, HARD: true },
  });
  const [postFilters, setPostFilters] = useState<PostFilters>({
    instrument: { GUITAR: true, BASS: true },
    difficulty: { EASY: true, NORMAL: true, HARD: true },
    sort: "LATEST",
  });


  const [refreshKey, setRefreshKey] = useState(0);

  const toggleInstrument = (key: keyof SheetFilters["instrument"]) =>
    setFilters((prev) => ({
      ...prev,
      instrument: { ...prev.instrument, [key]: !prev.instrument[key] },
    }));

  const toggleDifficulty = (key: keyof SheetFilters["difficulty"]) =>
    setFilters((prev) => ({
      ...prev,
      difficulty: { ...prev.difficulty, [key]: !prev.difficulty[key] },
    }));

  const togglePostInstrument = (key: keyof PostFilters["instrument"]) =>
    setPostFilters((prev) => ({
      ...prev,
      instrument: { ...prev.instrument, [key]: !prev.instrument[key] },
    }));

  const togglePostDifficulty = (key: keyof PostFilters["difficulty"]) =>
    setPostFilters((prev) => ({
      ...prev,
      difficulty: { ...prev.difficulty, [key]: !prev.difficulty[key] },
    }));

  const setPostSort = (key: PostSortKey) =>
    setPostFilters((prev) => ({
      ...prev,
      sort: key,
    }));

  const renderPanel = () => (
    <AnimatePresence mode="wait">
      {previewTab ? (
        <motion.div key="preview" initial={{ x: 80, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -80, opacity: 0 }}>
          <SheetDetailPanel
            key={refreshKey}
            sheet={previewTab}
            onBack={() => setPreviewTab(null)}
            onRefresh={() => refreshMySheets?.()}
          />
        </motion.div>
      ) : selectedSheet ? (
        <motion.div key="detail" initial={{ x: 80, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -80, opacity: 0 }}>
          <SheetDetailPanel
            key={refreshKey}
            sheet={selectedSheet}
            onBack={() => setSelectedSheet(null)}
            onRefresh={() => refreshMySheets?.()}
          />
        </motion.div>
      ) : selectedCommunityTab ? (
        <motion.div key="community" initial={{ x: 80, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -80, opacity: 0 }}>
          <PostDetailPanel
            key={selectedCommunityTab?.postId + "-" + refreshKey}
            post={selectedCommunityTab}
            onBack={() => setSelectedCommunityTab(null)}
            onRefresh={() => setRefreshKey(k => k + 1)}
          />
        </motion.div>
      ) : (
        <motion.div key={activeTab} initial={{ x: -80, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 80, opacity: 0 }}>
          {activeTab === "transcribe" && <TranscribePanel />}
          {activeTab === "mytabs" && (
            <MySheetsPanel
              filters={filters}
              onSelectTab={setSelectedSheet}
              onReadyRefresh={(fn) => setRefreshMySheets(() => fn)}
            />
          )}
          {activeTab === "community" && (
            <PostPanel filters={postFilters} onSelectPost={setSelectedCommunityTab} />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="min-h-screen flex bg-gradient-to-b from-black via-[#0b0220] to-[#120030] text-white pt-[60px]">
      <motion.aside className="w-64 flex flex-col py-10 px-6 border-r border-white/10 bg-white/5 backdrop-blur-lg">
        <div className="flex flex-col space-y-2">
          <button
            onClick={() => {
              setActiveTab("transcribe");
              setSelectedSheet(null);
              setPreviewTab(null);
              setSelectedCommunityTab(null);
            }}
            className={`flex items-center space-x-3 py-3 rounded-xl ${activeTab === "transcribe" ? "text-white" : "text-gray-400"
              }`}
          >
            <FontAwesomeIcon
              icon={faMusic}
              className={`w-5 h-5 ${activeTab === "transcribe" ? "text-blue-400" : "text-gray-500"
                }`}
            />
            <span>Transcribe</span>
          </button>

          <button
            onClick={() => {
              setActiveTab("mytabs");
              setSelectedSheet(null);
              setPreviewTab(null);
              setSelectedCommunityTab(null);
            }}
            className={`flex items-center space-x-3 py-3 rounded-xl ${activeTab === "mytabs" ? "text-white" : "text-gray-400"
              }`}
          >
            <FontAwesomeIcon
              icon={faFolderOpen}
              className={`w-5 h-5 ${activeTab === "mytabs" ? "text-blue-400" : "text-gray-500"
                }`}
            />
            <span>My TABs</span>
          </button>

          <AnimatePresence>
            {activeTab === "mytabs" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="ml-2 mt-2 space-y-6 text-sm">
                <div>
                  <h4 className="font-semibold text-gray-300 mb-3 flex justify-between">
                    Instrument
                    <button
                      onClick={() =>
                        setFilters((prev) => ({
                          ...prev,
                          instrument: { GUITAR: true, BASS: true },
                        }))
                      }
                      className="text-xs"
                    >
                      Reset
                    </button>
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {instrumentFilters.map((inst) => (
                      <button
                        key={inst.key}
                        onClick={() => toggleInstrument(inst.key)}
                        className={`px-3 py-1.5 rounded-full text-xs border ${filters.instrument[inst.key]
                          ? "text-blue-300 border-blue-500/60"
                          : "text-gray-400 border-white/10"
                          }`}
                      >
                        {inst.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-300 mb-3 flex justify-between">
                    Difficulty
                    <button
                      onClick={() =>
                        setFilters((prev) => ({
                          ...prev,
                          difficulty: { EASY: true, NORMAL: true, HARD: true },
                        }))
                      }
                      className="text-xs"
                    >
                      Reset
                    </button>
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {difficultyFilters.map((d) => (
                      <button
                        key={d.key}
                        onClick={() => toggleDifficulty(d.key)}
                        className={`px-3 py-1.5 rounded-full text-xs border ${filters.difficulty[d.key]
                          ? `${d.color} bg-white/10`
                          : "text-gray-400 border-white/10"
                          }`}
                      >
                        {d.label}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>




          <button
            onClick={() => {
              setActiveTab("community");
              setSelectedSheet(null);
              setPreviewTab(null);
              setSelectedCommunityTab(null);
            }}
            className={`flex items-center space-x-3 py-3 rounded-xl ${activeTab === "community" ? "text-white" : "text-gray-400"
              }`}
          >
            <FontAwesomeIcon
              icon={faPeopleGroup}
              className={`w-5 h-5 ${activeTab === "community" ? "text-blue-400" : "text-gray-500"
                }`}
            />
            <span>Community</span>
          </button>
          <AnimatePresence>
            {activeTab === "community" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="ml-2 mt-2 space-y-6 text-sm"
              >
                <div>
                  <h4 className="font-semibold text-gray-300 mb-3 flex justify-between">
                    Instrument
                    <button
                      onClick={() =>
                        setPostFilters((prev) => ({
                          ...prev,
                          instrument: { GUITAR: true, BASS: true },
                        }))
                      }
                      className="text-xs"
                    >
                      Reset
                    </button>
                  </h4>

                  <div className="flex flex-wrap gap-2">
                    {instrumentFilters.map((inst) => (
                      <button
                        key={inst.key}
                        onClick={() => togglePostInstrument(inst.key)}
                        className={`px-3 py-1.5 rounded-full text-xs border ${postFilters.instrument[inst.key]
                          ? "text-blue-300 border-blue-500/60"
                          : "text-gray-400 border-white/10"
                          }`}
                      >
                        {inst.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-300 mb-3 flex justify-between">
                    Difficulty
                    <button
                      onClick={() =>
                        setPostFilters((prev) => ({
                          ...prev,
                          difficulty: { EASY: true, NORMAL: true, HARD: true },
                        }))
                      }
                      className="text-xs"
                    >
                      Reset
                    </button>
                  </h4>

                  <div className="flex flex-wrap gap-2">
                    {difficultyFilters.map((d) => (
                      <button
                        key={d.key}
                        onClick={() => togglePostDifficulty(d.key)}
                        className={`px-3 py-1.5 rounded-full text-xs border ${postFilters.difficulty[d.key]
                          ? `${d.color} bg-white/10`
                          : "text-gray-400 border-white/10"
                          }`}
                      >
                        {d.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-300 mb-3 flex justify-between">
                    Sort
                    <button
                      onClick={() =>
                        setPostFilters((prev) => ({
                          ...prev,
                          sort: "LATEST",
                        }))
                      }
                      className="text-xs"
                    >
                      Reset
                    </button>
                  </h4>

                  <div className="flex flex-wrap gap-2">
                    {[
                      { key: "LATEST", label: "Latest" },
                      { key: "OLDEST", label: "Oldest" },
                      { key: "HIGHEST_RATED", label: "Highest Rated" },
                      { key: "LOWEST_RATED", label: "Lowest Rated" },
                    ].map((opt) => (
                      <button
                        key={opt.key}
                        onClick={() => setPostSort(opt.key as PostSortKey)}
                        className={`px-3 py-1.5 rounded-full text-xs border ${postFilters.sort === opt.key
                          ? "text-yellow-300 border-yellow-500/60 bg-white/10"
                          : "text-gray-400 border-white/10"
                          }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <TranscribeStatusList
          onPreview={(job: any) =>
            setPreviewTab({
              isPreview: true,
              title: job.songTitle,
              artist: job.artistName,
              instrument: job.instrument,
              difficulty: "NORMAL",
              sheetDataUrl: job.sheetDataUrl,
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
