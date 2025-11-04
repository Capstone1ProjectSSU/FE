import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEllipsis, // ✅ 추가
} from "@fortawesome/free-solid-svg-icons";
import { motion, AnimatePresence } from "framer-motion";
import Button from "../../common/Button";
import ModalPortal from "../../common/ModalPortal";
import { getSavedTabs } from "../../../services/TabService";
import Input from "../../common/Input";
import { useCommunity } from "../../../contexts/CommunityContext";

interface TabData {
  id: number;
  title: string;
  artist?: string;
  difficulty: string;
  instrument: string;
  date: string;
}

interface TabListProps {
  tabs?: TabData[];
  onDelete?: (id: number) => void;
  onSelectTab?: (tab: TabData) => void; // ✅ Dashboard에서 상세 보기용 콜백
}

export default function TabList({ tabs: externalTabs, onDelete, onSelectTab }: TabListProps) {
  const [tabs, setTabs] = useState<TabData[]>(externalTabs || []);
  const [confirmDelete, setConfirmDelete] = useState<TabData | null>(null);
  const [editTab, setEditTab] = useState<TabData | null>(null);
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const { sharedTabs } = useCommunity();

  /** ✅ 로컬 또는 props 동기화 */
  useEffect(() => {
    if (externalTabs) {
      setTabs(externalTabs);
    } else {
      const savedTabs = getSavedTabs();
      setTabs(savedTabs);
    }
  }, [externalTabs]);

  /** ✅ TAB 삭제 */
  const handleDelete = (id: number) => {
    const updated = tabs.filter((tab) => tab.id !== id);
    setTabs(updated);

    // 로컬스토리지 원본 삭제
    const raw = localStorage.getItem("myTabs");
    const origin = raw ? (JSON.parse(raw) as TabData[]) : [];
    const originUpdated = origin.filter((t) => t.id !== id);
    localStorage.setItem("myTabs", JSON.stringify(originUpdated));

    // 상위 동기화
    onDelete?.(id);
    setConfirmDelete(null);
  };

  /** ✅ TAB 수정 저장 + 날짜 자동 업데이트 */
  const handleEditSave = () => {
    if (!editTab) return;

    const formattedDate = new Date().toLocaleString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });

    const updated = tabs.map((tab) =>
      tab.id === editTab.id ? { ...editTab, date: formattedDate } : tab
    );

    setTabs(updated);
    localStorage.setItem("myTabs", JSON.stringify(updated));
    setEditTab(null);
  };

  /** ✅ TAB 다운로드 */
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

  /** ✅ 드롭다운 및 ESC 이벤트 */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
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

  /** ✅ 저장된 악보가 없을 때 */
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
      {/* TAB 카드 목록 */}
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {tabs.map((tab, idx) => {
          const isShared = sharedTabs.some((shared) => shared.id === tab.id);

          return (
            <motion.div
              key={tab.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="relative bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-md hover:border-blue-500/50 transition-all flex flex-col justify-between"
            >
              {/* 컨트롤 영역 */}
              <div className="absolute top-3 right-3" ref={dropdownRef}>
                {/* ⋮ 버튼 */}
                <button
                  onClick={() => setOpenDropdown(openDropdown === tab.id ? null : tab.id)}
                  className="text-gray-400 hover:text-white transition"
                >
                  <FontAwesomeIcon
                    icon={faEllipsis}
                    className="w-4 h-4 text-gray-400 hover:text-white transition rotate-90"
                  />
                </button>

                {/* 드롭다운 메뉴 */}
                <AnimatePresence>
                  {openDropdown === tab.id && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 bg-white/20 backdrop-blur-md border border-white/10 rounded-lg shadow-lg text-sm text-gray-200 z-50 overflow-hidden w-32"
                    >
                      <button
                        onClick={() => {
                          setEditTab(tab);
                          setOpenDropdown(null);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-white/10 transition"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => {
                          handleDownload("pdf", tab);
                          setOpenDropdown(null);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-white/10 transition"
                      >
                        📄 Download
                      </button>
                      <button
                        onClick={() => {
                          setConfirmDelete(tab);
                          setOpenDropdown(null);
                        }}
                        className="w-full text-left px-4 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition"
                      >
                        🗑 Delete
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>


              {/* ✅ 공유됨 표시 배지 */}
              {isShared && (
                <div className="absolute top-3 left-3 bg-blue-600/40 border border-blue-400/50 text-xs text-white px-2 py-0.5 rounded-full shadow-md backdrop-blur-sm">
                  Shared
                </div>
              )}

              {/* TAB 정보 */}
              <div>
                <h3 className="font-semibold text-lg text-white flex justify-center mt-4">
                  {tab.title} - {tab.artist}
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
                  onClick={() => onSelectTab?.(tab)}
                  variant="primary"
                  className="px-4 py-2 text-sm"
                >
                  Show
                </Button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* 🗑️ 삭제 모달 */}
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

      {/* ✏️ 수정 모달 */}
      <AnimatePresence>
        {editTab && (
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
                className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-8 w-96 text-white shadow-lg"
              >
                <h3 className="text-xl font-semibold mb-4 text-center">
                  악보 정보 수정
                </h3>

                <div className="space-y-4 text-left">
                  {/* 🎵 곡 제목 */}
                  <Input
                    label="곡 제목"
                    name="title"
                    value={editTab.title}
                    onChange={(e) =>
                      setEditTab({ ...editTab, title: e.target.value })
                    }
                  />

                  {/* 🎤 아티스트명 */}
                  <Input
                    label="아티스트명"
                    name="artist"
                    value={editTab.artist || ""}
                    onChange={(e) =>
                      setEditTab({ ...editTab, artist: e.target.value })
                    }
                  />

                  {/* 🎸 악기 선택 */}
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2">
                      악기
                    </label>
                    <select
                      value={editTab.instrument}
                      onChange={(e) =>
                        setEditTab({ ...editTab, instrument: e.target.value })
                      }
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-gray-200 focus:outline-none"
                    >
                      <option value="Electric Guitar">Electric Guitar</option>
                      <option value="Bass Guitar">Bass Guitar</option>
                    </select>
                  </div>

                  {/* 🎚 난이도 */}
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2">
                      난이도
                    </label>
                    <select
                      value={editTab.difficulty}
                      onChange={(e) =>
                        setEditTab({ ...editTab, difficulty: e.target.value })
                      }
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-gray-200 focus:outline-none"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>
                </div>

                {/* 하단 버튼 */}
                <div className="flex justify-between mt-6">
                  <Button
                    onClick={() => setEditTab(null)}
                    variant="outline"
                    className="w-[48%]"
                  >
                    취소
                  </Button>
                  <Button
                    onClick={handleEditSave}
                    variant="primary"
                    className="w-[48%]"
                  >
                    저장
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
