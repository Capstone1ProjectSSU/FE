import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { useTranscriptionHistory } from "../../../contexts/TranscriptionHistoryContext";
import { useState } from "react";
import type { TranscriptionStatus } from "../../../types/transcription";

export default function TranscribeStatusList({ onPreview }: any) {
  const { jobs, deleteJob, clearJobs, retryJob } = useTranscriptionHistory();
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
      <div className="mb-3">
        <h3 className="text-sm font-semibold text-gray-400 mb-2">
          Transcriptions
        </h3>

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
              className={`px-1 ${currentPage === totalPages ? "opacity-40" : ""
                }`}
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
            <button
              onClick={() => deleteJob(job.jobId)}
              className="absolute top-3 right-3 text-gray-400 hover:text-red-400 transition"
            >
              <FontAwesomeIcon icon={faXmark} className="w-3 h-3" />
            </button>

            <div className="flex justify-between items-center pr-6 mb-2">
              <span className="font-medium text-blue-300 truncate max-w-[140px]">
                {job.type === "TRANSCRIBE"
                  ? `${job.songTitle} – ${job.artistName}`
                  : `Difficulty Adjust`}
              </span>
              <StatusChip status={job.status} />
            </div>

            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>
                {job.type === "TRANSCRIBE"
                  ? job.instrument
                  : "Difficulty Adjust Request"}
              </span>
              <span>{job.queuedAt?.split("T")[0]}</span>
            </div>

            <div className="flex gap-2 mt-3">
              {job.status === "COMPLETED" && (
                <button
                  onClick={() => onPreview?.(job)}
                  className="px-3 py-1 text-xs rounded-lg bg-green-500/20 border border-green-400 text-green-300 hover:bg-green-500/30 transition"
                >
                  Preview
                </button>
              )}
              {job.status === "FAILED" && (
                <button
                  onClick={() => retryJob(job)}
                  className="px-3 py-1 text-xs rounded-lg bg-red-500/20 border border-red-400 text-red-300 hover:bg-red-500/30 transition"
                >
                  Retry
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

function StatusChip({ status }: { status: TranscriptionStatus }) {
  const map: Record<TranscriptionStatus, string> = {
    IDLE: "bg-grey-500/20 text-grey-300 border-grey-500/40",
    PENDING: "bg-yellow-500/20 text-yellow-300 border-yellow-500/40",
    PROCESSING: "bg-blue-500/20 text-blue-300 border-blue-500/40",
    COMPLETED: "bg-green-500/20 text-green-300 border-green-500/40",
    FAILED: "bg-red-500/20 text-red-300 border-red-500/40",
  };

  const classes = map[status] ?? map.PENDING;

  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] border ${classes}`}>
      {status}
    </span>
  );
}
