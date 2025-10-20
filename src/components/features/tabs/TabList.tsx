import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faFileExport,
  faFileAudio,
  faFileCode,
  faFilePdf,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { sampleTabs as initialTabs } from "../../../data/sampleTabs";
import Button from "../../common/Button";
import ModalPortal from "../../common/ModalPortal";

interface TabData {
  id: number;
  title: string;
  difficulty: string;
  instrument: string;
  date: string;
}

export default function TabList() {
  const [tabs, setTabs] = useState<TabData[]>(initialTabs);
  const [confirmDelete, setConfirmDelete] = useState<TabData | null>(null);
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  const handleDelete = (id: number) => {
    setTabs((prev) => prev.filter((tab) => tab.id !== id));
    setConfirmDelete(null);
  };

  const handleDownload = (type: "mp3" | "mxl" | "pdf", tab: TabData) => {
    const blob = new Blob([`Mock ${type.toUpperCase()} for ${tab.title}`], {
      type: "text/plain",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${tab.title}.${type}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpenDropdown(null);
      }
    };

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenDropdown(null);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  if (tabs.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center text-gray-400 py-12 bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl shadow-inner"
      >
        <p>No saved TABs yet 🎸</p>
        <p className="text-sm mt-1 text-gray-500">
          Try uploading a new audio in the Transcribe tab!
        </p>
      </motion.div>
    );
  }

  return (
    <>
      {/* ✅ gap-y 구조로 수정 */}
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {tabs.map((tab, idx) => (
          <motion.div
            key={tab.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            className="relative bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-md hover:border-blue-500/50 transition-all flex flex-col justify-between"
          >
            {/* Controls */}
            <div className="absolute top-3 right-3 flex items-center space-x-3">
              {/* Export */}
              <div className="relative" ref={dropdownRef}>
                <button
                  title="Export Options"
                  onClick={() =>
                    setOpenDropdown((prev) => (prev === tab.id ? null : tab.id))
                  }
                  className={`text-blue-400 hover:text-blue-300 transition ${openDropdown === tab.id ? "text-blue-300" : ""
                    }`}
                >
                  <FontAwesomeIcon icon={faFileExport} />
                </button>

                <AnimatePresence>
                  {openDropdown === tab.id && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-7 right-0 bg-white/30 backdrop-blur-lg border border-white/10 rounded-lg p-2 w-32 z-50 shadow-lg"
                    >
                      {[
                        { icon: faFileAudio, color: "text-blue-400", label: ".mp3", type: "mp3" },
                        { icon: faFileCode, color: "text-green-400", label: ".mxl", type: "mxl" },
                        { icon: faFilePdf, color: "text-red-400", label: ".pdf", type: "pdf" },
                      ].map((opt) => (
                        <button
                          key={opt.label}
                          onClick={() => handleDownload(opt.type as any, tab)}
                          className="flex items-center gap-2 w-full text-left px-2 py-1 rounded-md text-sm text-gray-200 hover:bg-white/20 transition"
                        >
                          <FontAwesomeIcon icon={opt.icon} className={opt.color} />
                          {opt.label}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Delete */}
              <button
                onClick={() => setConfirmDelete(tab)}
                title="Delete"
                className="text-red-400 hover:text-red-300 transition"
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>

            {/* TAB Info */}
            <div>
              <h3 className="font-semibold text-lg text-white flex justify-center mt-4">
                {tab.title}
              </h3>
              <p className="text-sm text-gray-400 mt-1">{tab.instrument}</p>
              <p className="text-xs text-gray-500 mt-2">
                Difficulty: {tab.difficulty}
              </p>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between mt-6 mb-0">
              <p className="text-xs text-gray-500">{tab.date}</p>
              <Button
                onClick={() => navigate(`/tab/${tab.id}`)}
                variant="primary"
                className="px-4 py-2 text-sm"
              >
                Show
              </Button>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {confirmDelete && (
          <ModalPortal>
            <motion.div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-8 w-80 text-center text-white shadow-lg"
              >
                <p className="mb-4">
                  정말{" "}
                  <span className="text-red-400 font-semibold">
                    {confirmDelete.title}
                  </span>{" "}
                  을(를) 삭제하시겠습니까?
                </p>
                <div className="flex justify-between mt-6">
                  <Button
                    onClick={() => setConfirmDelete(null)}
                    variant="outline"
                    className="w-[48%]"
                  >
                    취소
                  </Button>
                  <Button
                    onClick={() => handleDelete(confirmDelete.id)}
                    variant="primary"
                    className="w-[48%] bg-red-600 hover:bg-red-500"
                  >
                    삭제
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          </ModalPortal>
        )}
      </AnimatePresence>
    </>
  );
}
