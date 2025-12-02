export interface AudioUploadResponse {
  audioId: string;
  fileSize: number;
  filePath: string;
  uploadedAt: string;
}

export type TranscriptionStatus = "IDLE" | "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";

export interface TranscriptionRequestPayload {
  audioId: number | string;
  instrument: string; // "GUITAR" | "BASS"
}

export interface TranscriptionRequestResponse {
  jobId: string;
  aiJobId: string;
  status: TranscriptionStatus;
  queuedAt: string;
}

export interface TranscriptionStatusData {
  jobId: string;
  aiJobId: string;
  status: TranscriptionStatus;
  progressPercent: number;

  instrument: string;
  jobType: string;

  transcriptionUrl: string;
  separatedAudioUrl: string;
  chordProgressionUrl: string;

  format: string;
  musicId: string;
  errorMessage: string;

  queuedAt: string;
  startedAt: string;
  completedAt: string;
  failedAt: string;
  updatedAt: string;
}

export interface DifficultyRequestPayload {
  sheetId: number;
}

export interface DifficultyResponse {
  jobId: string;
  aiJobId: string;
  status: TranscriptionStatus;
  queuedAt: string;
}
