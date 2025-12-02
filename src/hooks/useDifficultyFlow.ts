import { useState } from "react";
import {
  requestDifficultyHarder,
  requestDifficultyEasier,
  getTranscriptionStatus,
} from "../services/TranscriptionService";

import { useTranscriptionHistory } from "../contexts/TranscriptionHistoryContext";
import { extractErrorMessage } from "../utils/error";
import type { TranscriptionStatus } from "../types/transcription";

export function useDifficultyFlow() {
  const history = useTranscriptionHistory();

  const [jobId, setJobId] = useState<string | null>(null);
  const [status, setStatus] = useState<TranscriptionStatus>("IDLE");
  const [progress, setProgress] = useState(0);

  const startDifficultyAdjust = async (
    sheetId: number,
    type: "HARDER" | "EASIER"
  ) => {
    const payload = { sheetId };
    const api =
      type === "HARDER" ? requestDifficultyHarder : requestDifficultyEasier;

    const res = await api(payload);
    if (!res.ok) throw new Error(extractErrorMessage(res.error));

    const newJobId = res.data.jobId;
    const initialStatus: TranscriptionStatus = res.data.status ?? "PENDING";

    setJobId(newJobId);
    setStatus(initialStatus);

    history.addJob({
      jobId: newJobId,
      type: "DIFFICULTY",
      songTitle: "",
      artistName: "",
      sheetId,
      difficulty: type === "HARDER" ? "HARD" : "EASY",
      status: initialStatus,
      queuedAt: res.data.queuedAt ?? new Date().toISOString(),
    });

    return { jobId: newJobId, status: initialStatus };
  };

  // Polling
  const pollStatus = async (pollJobId: string) => {
    let isFinished = false;

    while (!isFinished) {
      await new Promise((r) => setTimeout(r, 3500));

      const res = await getTranscriptionStatus(pollJobId);
      if (!res.ok) throw new Error(extractErrorMessage(res.error));

      const s = res.data;

      setStatus(s.status);
      setProgress(s.progressPercent ?? 0);

      history.updateJob({
          jobId: pollJobId,
          status: s.status,
          sheetDataUrl: s.chordProgressionUrl,
      });

      if (s.status === "COMPLETED" || s.status === "FAILED") {
        isFinished = true;
      }
    }

    return { jobId: pollJobId };
  };

  return {
    jobId,
    status,
    progress,
    startDifficultyAdjust,
    pollStatus,
  };
}

