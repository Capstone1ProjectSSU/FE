import { useState, useMemo, useRef, useEffect } from "react";
import { useCommunity } from "../../../contexts/CommunityContext";
import Button from "../../common/Button";
import type { TabComment } from "../../../types/community";

interface CommentSectionProps {
  tabId: number;
  comments: TabComment[];
}

export default function CommentSection({ tabId, comments }: CommentSectionProps) {
  const { addComment } = useCommunity();
  const [text, setText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5); // ✅ 동적 PAGE_SIZE
  const listRef = useRef<HTMLDivElement | null>(null);

  /** ✅ 상위 div 높이에 맞게 표시 가능한 댓글 개수 계산 */
  useEffect(() => {
    const el = listRef.current;
    if (!el) return;

    const observer = new ResizeObserver(() => {
      const height = el.clientHeight;
      const commentHeight = 56; // 평균 댓글 높이(px)
      const visibleCount = Math.max(2, Math.floor(height / commentHeight));
      setPageSize(visibleCount);
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  /** ✅ 페이지별로 자르기 */
  const pagedComments = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return comments.slice(start, start + pageSize);
  }, [comments, currentPage, pageSize]);

  /** ✅ 전체 페이지 수 */
  const totalPages = Math.max(1, Math.ceil(comments.length / pageSize));

  /** ✅ 댓글 추가 */
  const handleSubmit = () => {
    if (!text.trim()) return;
    const newComment: TabComment = {
      user: "Guest",
      text,
      date: new Date().toLocaleString(),
    };
    addComment(tabId, newComment);
    setText("");
    setCurrentPage(1);
  };

  return (
    <div className="flex flex-col h-full">
      {/* ✅ 댓글 목록 (동적 높이 감지 ref 추가) */}
      <div
        ref={listRef}
        className="flex-grow overflow-y-auto text-sm text-gray-300 space-y-1 border border-white/10 rounded-lg p-3 bg-white/5"
      >
        {pagedComments.length === 0 ? (
          <p className="text-gray-500 text-xs">아직 댓글이 없습니다.</p>
        ) : (
          pagedComments.map((c, idx) => (
            <div key={idx} className="border-b border-white/5 pb-1 mb-1">
              <span className="text-blue-300 font-semibold">{c.user}</span>: {c.text}
              <p className="text-gray-500 text-[10px]">{c.date}</p>
            </div>
          ))
        )}
      </div>

      {/* ✅ 페이지네이션 */}
      {totalPages > 1 && (
        <div className="flex-none flex justify-center items-center gap-3 text-xs text-gray-400 my-3">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className={`px-2 py-1 rounded ${currentPage === 1
                ? "text-gray-500 cursor-not-allowed"
                : "hover:text-white hover:bg-white/10 transition"
              }`}
          >
            ← Prev
          </button>

          <span className="text-gray-300">
            {currentPage} / {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className={`px-2 py-1 rounded ${currentPage === totalPages
                ? "text-gray-500 cursor-not-allowed"
                : "hover:text-white hover:bg-white/10 transition"
              }`}
          >
            Next →
          </button>
        </div>
      )}

      {/* ✅ 댓글 입력창 */}
      <div className="flex-none flex items-center gap-2 mt-auto pt-2 border-t border-white/10">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="댓글 입력..."
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
          className="flex-grow bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-400"
        />
        <Button
          onClick={handleSubmit}
          variant="primary"
          className="px-5 py-2 text-sm font-medium min-w-[90px]"
        >
          등록
        </Button>
      </div>
    </div>
  );
}
