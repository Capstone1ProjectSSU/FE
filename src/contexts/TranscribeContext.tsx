import { createContext, useContext, useState } from "react";
import toast from "react-hot-toast";
import {
  uploadAudio,
  requestTranscription,
  fetchTranscriptionStatus,
} from "../services/TranscriptionService";
import type { TranscriptionJob } from "../types/transcription";

interface UploadOptions {
  instrument: "GUITAR" | "BASS";
  songTitle: string;
  artistName: string;
}

interface TranscribeContextType {
  jobs: TranscriptionJob[];
  addJob: (job: TranscriptionJob) => void;
  updateJob: (data: Partial<TranscriptionJob> & { jobId: string }) => void;
  clearJobs: () => void;
  startPolling: (jobId: string) => void;
  uploadAndRequest: (file: File, options: UploadOptions) => Promise<void>;
}

const TranscribeContext = createContext<TranscribeContextType | null>(null);
const pollingRefs: Record<string, any> = {};
const pollingFailureCount: Record<string, number> = {};


export function TranscribeProvider({ children }: any) {
  const [jobs, setJobs] = useState<TranscriptionJob[]>([]);

  const addJob = (job: TranscriptionJob) => {
    setJobs((prev) => [...prev, job]);
  };

  const updateJob = (data: Partial<TranscriptionJob> & { jobId: string }) => {
    setJobs((prev) =>
      prev.map((j) => (j.jobId === data.jobId ? { ...j, ...data } : j))
    );
  };

  const clearJobs = () => {
    Object.values(pollingRefs).forEach(clearInterval);
    setJobs([]);
  };

  const startPolling = (jobId: string) => {
    if (pollingRefs[jobId]) return;

    pollingRefs[jobId] = setInterval(async () => {
      try {
        const status = await fetchTranscriptionStatus(jobId);

        // ⭐ 성공 시 오류 카운터 초기화
        pollingFailureCount[jobId] = 0;

        updateJob({
          jobId,
          status: status.status,
          sheetDataUrl: status.sheetDataUrl,
        });

        if (status.status === "COMPLETED" || status.status === "FAILED") {
          clearInterval(pollingRefs[jobId]);
          delete pollingRefs[jobId];
          delete pollingFailureCount[jobId];
        }
      } catch (err) {
        console.error("Polling failed", err);

        pollingFailureCount[jobId] = (pollingFailureCount[jobId] || 0) + 1;

        if (pollingFailureCount[jobId] >= 5) {
          clearInterval(pollingRefs[jobId]);
          delete pollingRefs[jobId];
          delete pollingFailureCount[jobId];

          updateJob({
            jobId,
            status: "FAILED",
          });
        }
      }
    }, 3000);
  };

  const uploadAndRequest = async (file: File, options: UploadOptions) => {
    try {
      /** 1) Upload */
      const uploadRes = await uploadAudio({
        audioFile: file,
        songTitle: options.songTitle,
        artistName: options.artistName,
      });

      const audioId = uploadRes.audioId; // string

      const req = await requestTranscription({
        audioId,
        instrument: options.instrument,
      });

      const jobId = req.jobId;

      addJob({
        jobId,
        audioId,
        instrument: options.instrument,
        songTitle: options.songTitle,
        artistName: options.artistName,
        status: req.status,
        queuedAt: req.queuedAt,
        sheetDataUrl: undefined, // ⭐ 초기값 명시
      });

      startPolling(jobId);

    } catch (err) {
      console.error(err);
      toast.error("전사 요청 중 오류 발생");
    }
  };

  return (
    <TranscribeContext.Provider
      value={{
        jobs,
        addJob,
        updateJob,
        clearJobs,
        startPolling,
        uploadAndRequest,
      }}
    >
      {children}
    </TranscribeContext.Provider>
  );
}

export function useTranscribe() {
  const ctx = useContext(TranscribeContext);
  if (!ctx) throw new Error("useTranscribe must be used inside TranscribeProvider");
  return ctx;
}
