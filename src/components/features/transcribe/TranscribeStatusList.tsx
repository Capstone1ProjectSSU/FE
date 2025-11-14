import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { useTranscribe } from "../../../contexts/TranscribeContext";
import type { TranscriptionJob } from "../../../types/transcription";
import { useState } from "react";

interface TranscribeStatusListProps {
  onPreview?: (job: TranscriptionJob) => void;
}

export default function TranscribeStatusList({ onPreview }: TranscribeStatusListProps) {
  const { jobs, updateJob, clearJobs } = useTranscribe(); // removeJob 없음
  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);

  const visibleJobs = jobs.filter((j) => !j.hidden);

  if (!visibleJobs.length) {
    return (
      <div className="mt-8 text-xs text-gray-500">
        No transcription activities yet.
      </div>
    );
  }

  const paginated = visibleJobs
    .slice()
    .sort((a, b) => (a.queuedAt < b.queuedAt ? 1 : -1))
    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const totalPages = Math.ceil(visibleJobs.length / itemsPerPage);

  return (
    <div className="mt-10 space-y-4">

      {/* Header */}
      <div className="mb-3">
        <h3 className="text-sm font-semibold text-gray-400 mb-2">
          Transcriptions
        </h3>

        {/* Pagination + Clear All */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs text-gray-400">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className={`px-1 ${currentPage === 1 ? "opacity-40" : ""}`}
            >
              &lt;
            </button>

            <span className="text-gray-300">
              {currentPage} / {totalPages || 1}
            </span>

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className={`px-1 ${currentPage === totalPages ? "opacity-40" : ""}`}
            >
              &gt;
            </button>
          </div>

          <button
            onClick={clearJobs}
            className="text-xs text-gray-400 hover:text-red-400 transition"
          >
            Clear All
          </button>
        </div>
      </div>

      {/* 리스트 */}
      <AnimatePresence>
        {paginated.map((job) => (
          <motion.div
            key={job.jobId}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
            className="relative bg-white/10 backdrop-blur-lg border border-white/10 rounded-xl p-4 text-sm text-gray-100 shadow-md"
          >
            {/* 삭제(X) 버튼 → hidden=true로 변경 */}
            <button
              onClick={() =>
                updateJob({
                  jobId: job.jobId,
                  hidden: true, // 👈 UI에서만 숨김 처리
                })
              }
              className="absolute top-3 right-3 text-gray-400 hover:text-red-400 transition"
            >
              <FontAwesomeIcon icon={faXmark} className="w-3 h-3" />
            </button>

            {/* 상단 Row */}
            <div className="flex justify-between items-center pr-6 mb-2">
              <span className="font-medium text-blue-300 truncate max-w-[140px]">
                {job.songTitle} – {job.artistName}
              </span>
              <StatusChip status={job.status} />
            </div>

            {/* Middle */}
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>{job.instrument}</span>
              <span>{job.queuedAt?.split("T")[0]}</span>
            </div>

            {/* Bottom */}
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => onPreview?.(job)}
                className="px-3 py-1 text-xs rounded-lg bg-white/5 border border-white/10 hover:border-blue-400 hover:text-blue-300 transition"
              >
                🔍 Preview
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

function StatusChip({ status }: { status: TranscriptionJob["status"] }) {
  const map = {
    PENDING: "bg-yellow-500/20 text-yellow-300 border-yellow-500/40",
    PROCESSING: "bg-blue-500/20 text-blue-300 border-blue-500/40",
    COMPLETED: "bg-green-500/20 text-green-300 border-green-500/40",
    FAILED: "bg-red-500/20 text-red-300 border-red-500/40",
  } as const;

  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] border ${map[status]}`}>
      {status}
    </span>
  );
}
