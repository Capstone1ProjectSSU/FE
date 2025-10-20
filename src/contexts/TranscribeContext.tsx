import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import toast from "react-hot-toast";

type TranscribeStatus = "idle" | "processing" | "done" | "error";
type TranscribeStep = "Analyzing" | "Transcribing" | "Generating TAB";

interface TranscribeContextType {
  status: TranscribeStatus;
  step: TranscribeStep;
  progress: number;
  instrument: "electric" | "bass";
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  fileName?: string;
  startTranscription: (
    file: File,
    instrument: "electric" | "bass",
    difficulty: "Beginner" | "Intermediate" | "Advanced"
  ) => void;
  reset: () => void;
}

const TranscribeContext = createContext<TranscribeContextType | undefined>(undefined);

export function TranscribeProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<TranscribeStatus>("idle");
  const [step, setStep] = useState<TranscribeStep>("Analyzing");
  const [progress, setProgress] = useState(0);
  const [instrument, setInstrument] = useState<"electric" | "bass">("electric");
  const [difficulty, setDifficulty] = useState<"Beginner" | "Intermediate" | "Advanced">(
    "Intermediate"
  );
  const [fileName, setFileName] = useState<string | undefined>();

  const reset = () => {
    setStatus("idle");
    setProgress(0);
    setStep("Analyzing");
    setFileName(undefined);
  };

  const startTranscription = (
    file: File,
    instrument: "electric" | "bass",
    difficulty: "Beginner" | "Intermediate" | "Advanced"
  ) => {
    setInstrument(instrument);
    setDifficulty(difficulty);
    setFileName(file.name);
    setStatus("processing");
    setProgress(0);
    setStep("Analyzing");

    const stages: TranscribeStep[] = ["Analyzing", "Transcribing", "Generating TAB"];
    let stageIndex = 0;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setStatus("done");
          return 100;
        }

        // ❌ 에러 시뮬레이션 (3% 확률)
        if (Math.random() < 0.03) {
          clearInterval(interval);
          setStatus("error");
          return prev;
        }

        const next = prev + 10;
        if (next % 35 === 0 && stageIndex < stages.length - 1) {
          stageIndex++;
          setStep(stages[stageIndex]);
        }
        return next;
      });
    }, 400);
  };

  // ✅ 전역 Toast 감시 (상태 변경 감지)
  useEffect(() => {
    if (status === "done") {
      toast.success("✅ Transcription Complete!", { id: "global-transcribe-complete" });
    }
    if (status === "error") {
      toast.error("❌ 변환 중 오류가 발생했습니다.", { id: "global-transcribe-error" });
    }
  }, [status]);

  return (
    <TranscribeContext.Provider
      value={{
        status,
        step,
        progress,
        instrument,
        difficulty,
        fileName,
        startTranscription,
        reset,
      }}
    >
      {children}
    </TranscribeContext.Provider>
  );
}

export function useTranscribe() {
  const context = useContext(TranscribeContext);
  if (!context) throw new Error("useTranscribe must be used within a TranscribeProvider");
  return context;
}
