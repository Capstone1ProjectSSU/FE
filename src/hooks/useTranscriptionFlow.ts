import { useState } from "react";
import {
    uploadAudio,
    requestTranscription,
    getTranscriptionStatus,
} from "../services/TranscriptionService";

import { useTranscriptionHistory } from "../contexts/TranscriptionHistoryContext";
import { extractErrorMessage } from "../utils/error";

export function useTranscriptionFlow() {
    const history = useTranscriptionHistory();

    const [audioId, setAudioId] = useState<string | null>(null);
    const [jobId, setJobId] = useState<string | null>(null);
    const [musicId, setMusicId] = useState<string | null>(null);
    const [status, setStatus] = useState("IDLE");
    const [progress, setProgress] = useState(0);

    // 1) Upload Audio
    const handleUpload = async (file: File, song: string, artist: string) => {
        const res = await uploadAudio(file, song, artist);
        if (!res.ok) throw new Error(extractErrorMessage(res.error));

        setAudioId(res.data.audioId);
        return res.data.audioId;
    };

    // 2) Transcription Request
    const startTranscription = async (audioId: number, instrument: string) => {
        const res = await requestTranscription({ audioId, instrument });
        if (!res.ok) throw new Error(extractErrorMessage(res.error));

        const newJobId = res.data.jobId;

        setJobId(newJobId);
        setStatus(res.data.status);

        history.addJob({
            jobId: newJobId,
            type: "TRANSCRIBE",
            audioId: String(audioId),
            songTitle: "",
            artistName: "",
            instrument,
            status: res.data.status,
            queuedAt: res.data.queuedAt,
        });

        return {
            jobId: newJobId,
            status: res.data.status,
        };
    };

    // 3) Polling 
    const pollStatus = async (pollJobId: string) => {
        let isFinished = false;
        let finalMusicId = null;

        while (!isFinished) {
            await new Promise((r) => setTimeout(r, 4000)); // 4초에 한 번씩 상태 체크

            const res = await getTranscriptionStatus(pollJobId);
            if (!res.ok) throw new Error(extractErrorMessage(res.error));

            const s = res.data;
            setStatus(s.status);
            setProgress(s.progressPercent);

            history.updateJob({
                jobId: pollJobId,
                status: s.status,
                sheetDataUrl: s.chordProgressionUrl,
            });

            if (s.status === "COMPLETED") {
                setMusicId(s.musicId);
                finalMusicId = s.musicId;
                isFinished = true;
            }
            if (s.status === "FAILED") {
                isFinished = true;
            }
        }

        return { jobId: pollJobId, musicId: finalMusicId };
    };

    return {
        audioId,
        jobId,
        musicId,
        status,
        progress,
        handleUpload,
        startTranscription,
        pollStatus,
    };
}
