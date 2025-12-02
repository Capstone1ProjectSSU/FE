import { handleWrappedApi } from "../utils/apiClient";
import type { ApiResult } from "../types/api";
import type {
  AudioUploadResponse,
  TranscriptionRequestPayload,
  TranscriptionRequestResponse,
  TranscriptionStatusData,
  DifficultyRequestPayload,
  DifficultyResponse,
} from "../types/transcription";

function authHeader(): Record<string, string> | undefined {
  const token = localStorage.getItem("accessToken");
  return token ? { Authorization: `Bearer ${token}` } : undefined;
}

export function uploadAudio(
  audioFile: File,
  songTitle: string,
  artistName: string
): Promise<ApiResult<AudioUploadResponse>> {
  const form = new FormData();
  form.append("audioFile", audioFile);
  form.append("songTitle", songTitle);
  form.append("artistName", artistName);

  return handleWrappedApi<AudioUploadResponse>("/audio/upload", {
    method: "POST",
    body: form,
    headers: {
      ...authHeader(),
    },
  });
}

export function requestTranscription(
  payload: TranscriptionRequestPayload
): Promise<ApiResult<TranscriptionRequestResponse>> {
  return handleWrappedApi<TranscriptionRequestResponse>("/transcription/request", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeader(),
    },
    body: JSON.stringify(payload),
  });
}

export function getTranscriptionStatus(
  jobId: string
): Promise<ApiResult<TranscriptionStatusData>> {
  return handleWrappedApi<TranscriptionStatusData>(
    `/api/transcription/status/${jobId}`,
    {
      method: "GET",
      headers: {
        ...authHeader(),
      },
    }
  );
}

export function requestDifficultyHarder(
  payload: DifficultyRequestPayload
): Promise<ApiResult<DifficultyResponse>> {
  return handleWrappedApi<DifficultyResponse>("/difficulty/harder", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeader(),
    },
    body: JSON.stringify(payload),
  });
}

export function requestDifficultyEasier(
  payload: DifficultyRequestPayload
): Promise<ApiResult<DifficultyResponse>> {
  return handleWrappedApi<DifficultyResponse>("/difficulty/easier", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeader(),
    },
    body: JSON.stringify(payload),
  });
}
