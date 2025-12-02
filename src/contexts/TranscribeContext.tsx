import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

type TranscribeStatus = "processing" | "done" | "error";
type TranscribeStep = "Analyzing" | "Transcribing" | "Generating TAB";

interface TranscribeItem {
  id: string;
  fileName: string;
  file?: File; // 👈 Retry 시 재사용을 위한 원본 파일
  instrument: "electric" | "bass";
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  status: TranscribeStatus;
  step: TranscribeStep;
  progress: number;
  date: string;
}

interface TranscribeContextType {
  transcriptions: TranscribeItem[];
  startTranscription: (
    file: File,
    instrument: "electric" | "bass",
    difficulty: "Beginner" | "Intermediate" | "Advanced",
    retryId?: string // 👈 Retry용 id
  ) => void;
  removeTranscription: (id: string) => void;
  resetAll: () => void;
}

const TranscribeContext = createContext<TranscribeContextType | undefined>(undefined);

export function TranscribeProvider({ children }: { children: ReactNode }) {
  const [transcriptions, setTranscriptions] = useState<TranscribeItem[]>([]);

  const startTranscription = (
    file: File,
    instrument: "electric" | "bass",
    difficulty: "Beginner" | "Intermediate" | "Advanced",
    retryId?: string
  ) => {
    // 🔁 Retry: 기존 아이템을 그대로 재활용
    let id = retryId ?? crypto.randomUUID();
    const newItem: TranscribeItem = {
      id,
      file,
      fileName: file.name,
      instrument,
      difficulty,
      status: "processing",
      step: "Analyzing",
      progress: 0,
      date: new Date().toISOString(),
    };

    // Retry일 경우 기존 항목 덮어쓰기
    setTranscriptions((prev) => {
      const filtered = prev.filter((t) => t.id !== id);
      return [newItem, ...filtered];
    });

    const stages: TranscribeStep[] = ["Analyzing", "Transcribing", "Generating TAB"];
    let stageIndex = 0;

    const interval = setInterval(() => {
      setTranscriptions((prev) =>
        prev.map((item) => {
          if (item.id !== id) return item;

          const nextProgress = item.progress + 10;

          if (Math.random() < 0.03) {
            clearInterval(interval);
            return { ...item, status: "error" };
          }

          if (nextProgress >= 100) {
            clearInterval(interval);
            return { ...item, progress: 100, status: "done" };
          }

          let nextStep = item.step;
          if (nextProgress % 35 === 0 && stageIndex < stages.length - 1) {
            stageIndex++;
            nextStep = stages[stageIndex];
          }

          return { ...item, progress: nextProgress, step: nextStep };
        })
      );
    }, 400);
  };

  const removeTranscription = (id: string) => {
    setTranscriptions((prev) => prev.filter((t) => t.id !== id));
  };

  const resetAll = () => {
    setTranscriptions([]);
  };

  return (
    <TranscribeContext.Provider
      value={{
        transcriptions,
        startTranscription,
        removeTranscription,
        resetAll,
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
