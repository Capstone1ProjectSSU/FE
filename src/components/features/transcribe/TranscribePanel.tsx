import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import DragDropZone from "./DragDropZone";
import FilePreview from "./FilePreview";
import ProgressBar from "../../common/ProgressBar";
import Button from "../../common/Button";
import Input from "../../common/Input";
import ModalPortal from "../../common/ModalPortal";
import { useTranscribe } from "../../../contexts/TranscribeContext";
import { useTabs } from "../../../contexts/TabContext";
import toast from "react-hot-toast";

export default function TranscribePanel() {
  const [file, setFile] = useState<File | null>(null);
  const [instrument, setInstrument] = useState<"electric" | "bass">("electric");
  const [difficulty, setDifficulty] = useState<"Beginner" | "Intermediate" | "Advanced">(
    "Intermediate"
  );
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [songTitle, setSongTitle] = useState("");
  const [artistName, setArtistName] = useState("");

  const { transcriptions, startTranscription } = useTranscribe();
  const { addTab } = useTabs();
  const navigate = useNavigate();

  const handleTranscribe = () => {
    if (!file) return toast.error("먼저 MP3 파일을 업로드하세요.");
    startTranscription(file, instrument, difficulty);
    toast.success("🎧 트랜스크립션이 시작되었습니다!");
    setFile(null);
  };

  const handleSave = () => {
  if (!songTitle.trim() || !artistName.trim()) {
    return toast.error("곡 이름과 가수명을 모두 입력해주세요.");
  }

  addTab({
    title: songTitle,
    artist: artistName, // ✅ 새로 추가됨
    instrument: instrument === "electric" ? "Electric Guitar" : "Bass Guitar",
    difficulty,
  });

  toast.success("🎵 TAB이 My Tabs에 저장되었습니다!");
  setShowSaveModal(false);
  navigate("/dashboard");
};


  const activeJob = transcriptions.find((t) => t.status === "processing");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col items-center text-center space-y-8 text-white"
    >
      {/* Title */}
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
      >
        🎸 Audio Transcription
      </motion.h2>

      <p className="text-gray-400 max-w-xl">
        Upload your MP3, choose your instrument and difficulty,
        and watch progress in both the panel and sidebar.
      </p>

      {/* Upload Settings */}
      <div className="flex flex-col sm:flex-row sm:space-x-8 space-y-4 sm:space-y-0 w-full justify-center">
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-300 mb-2 text-left">
            Instrument
          </label>
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
          <label className="text-sm font-medium text-gray-300 mb-2 text-left">
            Difficulty
          </label>
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

      {/* Upload Zone */}
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

      {/* ✅ Panel에도 현재 진행 상태 표시 */}
      <AnimatePresence>
        {activeJob && (
          <motion.div
            key={activeJob.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.4 }}
            className="mt-6 bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl p-6 shadow-lg w-full max-w-md"
          >
            <p className="text-blue-300 font-medium mb-3">
              {activeJob.step}... ({activeJob.fileName})
            </p>
            <ProgressBar progress={activeJob.progress} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Save Modal */}
      <AnimatePresence>
        {showSaveModal && (
          <ModalPortal>
            <motion.div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-8 w-96 text-white shadow-lg"
              >
                <h3 className="text-xl font-semibold mb-4 text-center">악보 저장</h3>
                <div className="space-y-4 text-left">
                  <Input
                    name="songTitle"
                    label="곡 이름"
                    placeholder="예: Wonderwall"
                    value={songTitle}
                    onChange={(e) => setSongTitle(e.target.value)}
                  />
                  <Input
                    name="artistName"
                    label="가수명"
                    placeholder="예: Oasis"
                    value={artistName}
                    onChange={(e) => setArtistName(e.target.value)}
                  />
                </div>
                <div className="flex justify-between mt-6">
                  <Button
                    onClick={() => setShowSaveModal(false)}
                    variant="outline"
                    className="w-[48%]"
                  >
                    취소
                  </Button>
                  <Button
                    onClick={handleSave}
                    variant="primary"
                    className="w-[48%]"
                  >
                    저장
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          </ModalPortal>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
