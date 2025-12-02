import { motion, AnimatePresence } from "framer-motion";
import type { PostListItem } from "../../../types/post";
import Button from "../../common/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import { useState, useRef, useEffect } from "react";

interface PostCardProps {
  post: PostListItem;
  onSelect: () => void;
}

export default function PostCard({ post, onSelect }: PostCardProps) {
  const [openDropdown, setOpenDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  /** 외부 클릭 감지 */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="relative bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-md hover:border-blue-500/50 transition-all flex flex-col justify-between"
    >
      <div className="absolute top-3 right-3" ref={dropdownRef}>
        <button
          onClick={() => setOpenDropdown((prev) => !prev)}
          className="text-gray-400 hover:text-white"
        >
          <FontAwesomeIcon icon={faEllipsis} className="w-4 h-4 rotate-90" />
        </button>

        <AnimatePresence>
          {openDropdown && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="absolute right-0 mt-2 bg-white/20 backdrop-blur-md border border-white/10 rounded-lg shadow-lg text-sm text-gray-200 w-32 z-50"
            >
              <button
                onClick={() => setOpenDropdown(false)}
                className="px-4 py-2 w-full text-left hover:bg-white/10"
              >
                📄 Download (미구현)
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div>
        <h3 className="font-semibold text-lg text-white text-center mt-4 truncate">
          {post.title}
        </h3>
        <p className="text-sm text-gray-400 mt-1 text-center">
          {post.artist}
        </p>
      </div>

      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center space-x-1">
          <span className="text-yellow-400 mr-2">⭐</span>
          <span className="text-sm text-gray-300">
            {post.rating.toFixed(1)}
          </span>
        </div>
        <span className="text-xs text-gray-400">{post.commentCount} comments</span>
      </div>

      <div className="flex items-center justify-between mt-6">
        <p className="text-xs text-gray-500">
          {new Date(post.createdAt).toLocaleDateString()}
        </p>
        <Button onClick={onSelect} variant="primary" className="px-4 py-2">
          Show
        </Button>
      </div>
    </motion.div>
  );
}
