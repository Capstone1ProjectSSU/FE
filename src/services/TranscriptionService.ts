const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080/api";
import type { TranscriptionJob } from "../types/transcription";

export interface UploadAudioPayload {
  audioFile: File;
  songTitle: string;
  artistName: string;
}

export interface UploadAudioData {
  audioId: string;
  fileSize: number;
  filePath: string;
  uploadedAt: string;
}

export interface UploadAudioResponseEnvelope {
  success: boolean;
  code: number;
  message: string;
  data: UploadAudioData;
}

export type TranscriptionStatus = "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";

export interface TranscriptionRequestPayload {
  audioId: string | number;
  instrument: string;
}

export interface TranscriptionRequestEnvelope {
  success: boolean;
  code: number;
  message: string;
  data: TranscriptionJob;
}

async function handleJson<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Request failed with status ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export async function uploadAudio(payload: UploadAudioPayload): Promise<UploadAudioData> {
  const formData = new FormData();
  formData.append("audioFile", payload.audioFile);
  formData.append("songTitle", payload.songTitle);
  formData.append("artistName", payload.artistName);

  const res = await fetch(`${API_BASE_URL}/audio/upload`, {
    method: "POST",
    body: formData,
  });

  const json = await handleJson<UploadAudioResponseEnvelope>(res);
  return json.data;
}

export async function requestTranscription(
  payload: TranscriptionRequestPayload
): Promise<TranscriptionJob> {
  const body = {
    audioId: typeof payload.audioId === "string" ? Number(payload.audioId) : payload.audioId,
    instrument: payload.instrument,
  };

  const res = await fetch(`${API_BASE_URL}/transcription/request`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const json = await handleJson<TranscriptionRequestEnvelope>(res);
  return json.data;
}

export async function fetchTranscriptionStatus(jobId: string) {
  const res = await fetch(`${API_BASE_URL}/transcription/request/${jobId}`, {
    method: "GET",
  });

  const json = await handleJson<TranscriptionRequestEnvelope>(res);
  return json.data; // { jobId, audioId, status, queuedAt }
}
