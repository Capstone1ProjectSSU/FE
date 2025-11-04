import { motion, AnimatePresence } from "framer-motion";
import type { TabItem } from "../../../types/tab";
import Button from "../../common/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import { useState, useRef, useEffect } from "react";

interface CommunityCardProps {
  tab: TabItem;
  onSelect: () => void;
}

export default function CommunityCard({ tab, onSelect }: CommunityCardProps) {
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  /** ✅ 외부 클릭 시 드롭다운 닫기 */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.2 }}
      className="relative bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-md hover:border-blue-500/50 transition-all flex flex-col justify-between"
    >
      {/* 컨트롤 영역 */}
      <div className="absolute top-3 right-3" ref={dropdownRef}>
        <button
          onClick={() => setOpenDropdown(openDropdown === tab.id ? null : tab.id)}
          className="text-gray-400 hover:text-white transition"
        >
          <FontAwesomeIcon
            icon={faEllipsis}
            className="w-4 h-4 text-gray-400 hover:text-white transition rotate-90"
          />
        </button>

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
                  const blob = new Blob([`Mock PDF for ${tab.title}`], {
                    type: "application/pdf",
                  });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `${tab.title}.pdf`;
                  a.click();
                  URL.revokeObjectURL(url);
                  setOpenDropdown(null);
                }}
                className="w-full text-left px-4 py-2 hover:bg-white/10 transition"
              >
                📄 Download
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* TAB 정보 */}
      <div>
        <h3 className="font-semibold text-lg text-white flex justify-center mt-4">
          {tab.title} - {tab.artist}
        </h3>
        <p className="text-sm text-gray-400 mt-1">{tab.instrument}</p>
        <p className="text-xs text-gray-500 mt-2">Difficulty: {tab.difficulty}</p>
      </div>

      {/* ✅ 평점 & 댓글 수 */}
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center space-x-1">
          <span className="text-yellow-400">⭐</span>
          <span className="text-sm text-gray-300">
            {tab.rating ? tab.rating.toFixed(1) : "0.0"}
          </span>
        </div>
        <span className="text-xs text-gray-400">
          {tab.comments?.length || 0} comments
        </span>
      </div>

      {/* ✅ Footer - Show 버튼 */}
      <div className="flex items-center justify-between mt-6 mb-0">
        <p className="text-xs text-gray-500">{tab.date}</p>
        <Button
          onClick={onSelect}
          variant="primary"
          className="px-4 py-2 text-sm"
        >
          Show
        </Button>
      </div>
    </motion.div>
  );
}
