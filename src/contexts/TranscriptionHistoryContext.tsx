import { createContext, useContext, useEffect, useState } from "react";
import type { TranscriptionStatus } from "../types/transcription";
import {
  requestTranscription,
  requestDifficultyEasier,
  requestDifficultyHarder,
} from "../services/TranscriptionService";

export type JobType = "TRANSCRIBE" | "DIFFICULTY";

export interface HistoryJob {
  jobId: string;
  type: JobType;

  sheetId?: number;
  audioId?: string;

  songTitle?: string;
  artistName?: string;
  instrument?: string;

  difficultyDirection?: "EASIER" | "HARDER";
  difficulty?: string;

  status: TranscriptionStatus;
  queuedAt: string;

  sheetDataUrl?: string;
  hidden?: boolean;
}

interface HistoryContextType {
  jobs: HistoryJob[];
  addJob: (job: HistoryJob) => void;
  updateJob: (patch: Partial<HistoryJob> & { jobId: string }) => void;
  deleteJob: (jobId: string) => void;
  clearJobs: () => void;
  retryJob: (job: HistoryJob) => Promise<void>;
}

const TranscriptionHistoryContext = createContext<HistoryContextType | null>(null);

export function TranscriptionHistoryProvider({ children }: { children: React.ReactNode }) {
  const [jobs, setJobs] = useState<HistoryJob[]>(() => {
    try {
      const saved = localStorage.getItem("transcription_jobs");
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Failed to parse transcription_jobs", e);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("transcription_jobs", JSON.stringify(jobs));
    } catch (e) {
      console.error("Failed to save transcription_jobs", e);
    }
  }, [jobs]);

  const addJob = (job: HistoryJob) => {
    const exists = jobs.some((j) => String(j.jobId) === String(job.jobId));
    if (exists) return;
    setJobs((prev) => [...prev, job]);
  };

  const updateJob = (patch: Partial<HistoryJob> & { jobId: string }) => {
    setJobs((prev) =>
      prev.map((j) => (j.jobId === patch.jobId ? { ...j, ...patch } : j))
    );
  };

  const deleteJob = (jobId: string) => {
    setJobs((prev) => {
      const next = prev.filter((j) => j.jobId !== jobId);
      localStorage.setItem("transcription_jobs", JSON.stringify(next));
      return next;
    });
  };

  const clearJobs = () => setJobs([]);

  const retryJob = async (job: HistoryJob) => {
    try {
      updateJob({ jobId: job.jobId, status: "PENDING" });

      if (job.type === "TRANSCRIBE") {
        await requestTranscription({
          audioId: job.audioId!,
          instrument: job.instrument?.toLowerCase() ?? "",
        });
      } else {
        if (job.difficultyDirection === "EASIER") {
          await requestDifficultyEasier({ sheetId: job.sheetId! });
        } else {
          await requestDifficultyHarder({ sheetId: job.sheetId! });
        }
      }
    } catch (err) {
      console.error("Retry failed:", err);
      updateJob({ jobId: job.jobId, status: "FAILED" });
    }
  };

  return (
    <TranscriptionHistoryContext.Provider
      value={{
        jobs,
        addJob,
        updateJob,
        deleteJob,
        clearJobs,
        retryJob,
      }}
    >
      {children}
    </TranscriptionHistoryContext.Provider>
  );
}

export function useTranscriptionHistory() {
  const ctx = useContext(TranscriptionHistoryContext);
  if (!ctx) throw new Error("useTranscriptionHistory must be used inside Provider");
  return ctx;
}
