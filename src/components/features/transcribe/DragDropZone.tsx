import { useState } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudArrowUp, faMusic } from "@fortawesome/free-solid-svg-icons";

interface DragDropZoneProps {
  onFileSelect?: (file: File) => void;
}

export default function DragDropZone({ onFileSelect }: DragDropZoneProps) {
  const [dragOver, setDragOver] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type === "audio/mpeg") {
      setFileName(file.name);
      onFileSelect?.(file);
    } else {
      alert("MP3 파일만 업로드할 수 있습니다.");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "audio/mpeg") {
      setFileName(file.name);
      onFileSelect?.(file);
    } else {
      alert("MP3 파일만 업로드할 수 있습니다.");
    }
  };

  return (
    <motion.div
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`relative border-2 border-dashed rounded-2xl p-10 text-center transition-all duration-300 
        ${
          dragOver
            ? "border-blue-500 bg-blue-500/10 shadow-[0_0_25px_rgba(59,130,246,0.5)] scale-[1.02]"
            : "border-white/10 bg-white/5 hover:border-blue-400 hover:shadow-[0_0_15px_rgba(59,130,246,0.3)]"
        }`}
    >
      <div className="flex flex-col items-center space-y-4 text-gray-200">
        <FontAwesomeIcon
          icon={dragOver ? faCloudArrowUp : faMusic}
          className={`text-4xl ${
            dragOver ? "text-blue-400 animate-pulse" : "text-blue-300"
          }`}
        />
        <p className="text-base font-medium">
          {fileName ? (
            <>
              선택된 파일:{" "}
              <span className="text-blue-400 font-semibold">{fileName}</span>
            </>
          ) : (
            "MP3 파일을 여기에 드래그하세요"
          )}
        </p>
        <p className="text-sm text-gray-400">
          또는 아래 버튼으로 파일을 선택하세요.
        </p>

        {/* ✅ Upload Button (Button.tsx와 동일 스타일) */}
        <label className="relative inline-block cursor-pointer mt-3">
          <span
            className={`flex items-center justify-center gap-2 px-5 py-2 rounded-lg font-medium text-sm 
              bg-gradient-to-r from-blue-600 to-purple-600 text-white 
              hover:from-blue-500 hover:to-purple-500 
              shadow-md shadow-blue-500/20 hover:shadow-blue-500/40 
              transition-all duration-300`}
          >
            <FontAwesomeIcon icon={faCloudArrowUp} className="text-white" />
            파일 선택
          </span>
          <input
            type="file"
            accept=".mp3"
            className="hidden"
            onChange={handleChange}
          />
        </label>
      </div>

      {/* Glow ring animation */}
      {dragOver && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 rounded-2xl border-2 border-blue-500 blur-md pointer-events-none"
        />
      )}
    </motion.div>
  );
}
