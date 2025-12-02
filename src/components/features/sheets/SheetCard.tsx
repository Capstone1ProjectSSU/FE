import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import type { SheetListItem } from "../../../types/sheet";

interface SheetCardProps {
  sheet: SheetListItem;
  idx: number;
  onSelect?: (sheet: SheetListItem) => void;
  onShare: (sheet: SheetListItem) => void;
  onEdit: (sheet: SheetListItem) => void;
  onDelete: (sheet: SheetListItem) => void;
}

export default function SheetCard({
  sheet,
  idx,
  onSelect,
  onShare,
  onEdit,
  onDelete,
}: SheetCardProps) {
  const [openDropdown, setOpenDropdown] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: idx * 0.1 }}
      className="relative bg-white/10 backdrop-blur-xl border border-white/10 
                 rounded-2xl p-4 shadow-md hover:border-blue-500/50 transition-all 
                 flex flex-col justify-between"
    >
      <span
        className={`absolute top-3 left-3 px-2 py-1 rounded-md text-xs border ${sheet.share === 1
          ? "text-blue-300 border-blue-500/40 bg-blue-500/10"
          : "text-gray-400 border-white/20 bg-white/5"
          }`}
      >
        {sheet.share === 1 ? "Shared" : "Unshared"}
      </span>
      <div className="absolute top-3 right-3">
        <button
          onClick={() => setOpenDropdown((prev) => !prev)}
          className="text-gray-400 hover:text-white transition"
        >
          <FontAwesomeIcon
            icon={faEllipsis}
            className="w-4 h-4 rotate-90"
          />
        </button>

        <AnimatePresence>
          {openDropdown && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 mt-2 bg-white/20 backdrop-blur-md border 
                         border-white/10 rounded-lg shadow-lg text-sm text-gray-200 
                         w-32 z-50 overflow-hidden"
            >
              <button
                onClick={() => {
                  onShare(sheet);
                  setOpenDropdown(false);
                }}
                className="w-full text-left px-4 py-2 hover:bg-white/10 transition"
              >
              {sheet.share === 1 ? "공유 해제" : "공유"}
            </button>
              <button
                onClick={() => {
                  onEdit(sheet);
                  setOpenDropdown(false);
                }}
                className="w-full text-left px-4 py-2 hover:bg-white/10 transition"
              >
                ✏️ Edit
              </button>

              <button
                onClick={() => {
                  onDelete(sheet);
                  setOpenDropdown(false);
                }}
                className="w-full text-left px-4 py-2 text-red-400 hover:bg-red-500/10 transition"
              >
                🗑 Delete
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mg-2">
        <h3 className="font-semibold text-lg text-white flex justify-center mt-6 truncate">
          {sheet.title}
        </h3>
        <p className="text-sm text-gray-400 mt-1">{sheet.artist}</p>
        <p className="text-sm text-gray-400 mt-1">{sheet.instrument}</p>
        <p className="text-xs text-gray-500 mt-2">
          Difficulty: {sheet.difficulty}
        </p>
      </div>

      <div className="flex items-center justify-between mt-6">
        <p className="text-xs text-gray-500">
          {sheet.createdAt?.split("T")[0] ?? ""}
        </p>

        <button
          onClick={() => onSelect?.(sheet)}
          className="px-4 py-2 text-sm bg-blue-500 hover:bg-blue-600 rounded-lg transition"
        >
          Show
        </button>
      </div>
    </motion.div>
  );
}
