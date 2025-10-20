import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import DragDropZone from "../upload/DragDropZone";
import FilePreview from "../upload/FilePreview";
import ProgressBar from "../upload/ProgressBar";
import { useTranscribe } from "../../../contexts/TranscribeContext";
import { useTab } from "../../../contexts/TabContext";
import toast from "react-hot-toast";
import Button from "../../common/Button";

export default function TranscribePanel() {
  const [file, setFile] = useState<File | null>(null);
  const [instrument, setInstrument] = useState<"electric" | "bass">("electric");
  const [difficulty, setDifficulty] = useState<"Beginner" | "Intermediate" | "Advanced">(
    "Intermediate"
  );

  const { status, progress, step, startTranscription, reset } = useTranscribe();
  const { addTab } = useTab();
  const navigate = useNavigate();

  const handleTranscribe = () => {
    if (!file) return toast.error("먼저 MP3 파일을 업로드하세요.");
    startTranscription(file, instrument, difficulty);
  };

  const handleSave = () => {
    if (!file) return;
    addTab({
      title: file.name.replace(".mp3", ""),
      instrument: instrument === "electric" ? "Electric Guitar" : "Bass Guitar",
      difficulty,
    });
    toast.success("🎵 TAB이 MyTabs에 저장되었습니다!");
    navigate("/dashboard");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col items-center text-center space-y-8 text-white"
    >
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
      >
        🎸 Audio Transcription
      </motion.h2>

      <p className="text-gray-400 max-w-xl">
        Upload your MP3, choose your instrument and difficulty, and let the AI generate your guitar TAB.
      </p>

      {/* Settings */}
      {status === "idle" && (
        <>
          <div className="flex flex-col sm:flex-row sm:space-x-8 space-y-4 sm:space-y-0 w-full justify-center">
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-300 mb-2 text-left">Instrument</label>
              <select
                value={instrument}
                onChange={(e) => setInstrument(e.target.value as "electric" | "bass")}
                className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-400 transition-all"
              >
                <option value="electric">🎸 Electric Guitar</option>
                <option value="bass">🎵 Bass Guitar</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-300 mb-2 text-left">Difficulty</label>
              <select
                value={difficulty}
                onChange={(e) =>
                  setDifficulty(e.target.value as "Beginner" | "Intermediate" | "Advanced")
                }
                className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-400 transition-all"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full max-w-xl"
          >
            <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-lg">
              <DragDropZone onFileSelect={setFile} />
              {file && (
                <div className="mt-6">
                  <FilePreview file={file} onTranscribe={handleTranscribe} />
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}

      {/* Processing */}
      {status === "processing" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6 bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl p-8 shadow-md w-full max-w-md"
        >
          <p className="text-blue-300 font-medium">{step}...</p>
          <ProgressBar progress={progress} />
        </motion.div>
      )}

      {/* Completed */}
      {status === "done" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-6 bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl p-8 shadow-md w-full max-w-md"
        >
          <p className="text-green-400 font-medium text-lg">✅ Transcription Complete!</p>
          <div className="flex justify-center space-x-4">
            <Button onClick={handleSave} variant="primary" className="flex items-center gap-2">
              💾 Save TAB
            </Button>
            <Button
              onClick={() => navigate(`/tab/1`, { state: { instrument, difficulty } })}
              variant="outline"
              className="flex items-center gap-2"
            >
              ▶️ View TAB
            </Button>
          </div>
        </motion.div>
      )}

      {/* Error */}
      {status === "error" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-6 bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl p-8 shadow-md w-full max-w-md"
        >
          <p className="text-red-400 font-medium">❌ Transcription failed. Please try again.</p>
          <Button onClick={reset} variant="primary">
            Retry
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
}
