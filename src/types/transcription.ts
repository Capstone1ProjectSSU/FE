import type { Instrument } from "./sheet";
import type { TranscriptionStatus } from "../services/TranscriptionService";

export interface TranscriptionJob {
  jobId: string;          // 전사 작업 ID
  audioId: string;        // 업로드된 파일 ID
  instrument: Instrument
  songTitle: string;
  artistName: string;
  status: TranscriptionStatus;  // PENDING | PROCESSING | COMPLETED | FAILED
  queuedAt: string;
  sheetDataUrl?: string;
  hidden?: boolean;
}
