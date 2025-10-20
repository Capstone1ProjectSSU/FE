import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faFileAudio,
  faWandMagicSparkles,
} from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import Button from "../../common/Button";

interface FilePreviewProps {
  file: File;
  onTranscribe?: () => void;
}

export default function FilePreview({ file, onTranscribe }: FilePreviewProps) {
  const handlePlay = () => {
    const audio = new Audio(URL.createObjectURL(file));
    audio.play();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-lg transition-all duration-300 hover:border-blue-400 hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]"
    >
      {/* File Info */}
      <div className="flex items-center gap-4 text-white">
        <FontAwesomeIcon
          icon={faFileAudio}
          className="text-blue-400 text-3xl drop-shadow"
        />
        <div className="text-left">
          <p className="font-semibold text-lg truncate max-w-xs">{file.name}</p>
          <p className="text-sm text-gray-400">
            {(file.size / 1024 / 1024).toFixed(2)} MB
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-between mt-6 items-center">
        <button
          onClick={handlePlay}
          className="flex items-center gap-2 text-gray-300 hover:text-blue-400 transition-colors"
        >
          <FontAwesomeIcon icon={faPlay} />
          <span>Preview</span>
        </button>

        <Button
          onClick={onTranscribe}
          variant="primary"
          className="flex items-center gap-2 px-5 py-2"
        >
          <FontAwesomeIcon icon={faWandMagicSparkles} />
          Transcribe
        </Button>
      </div>
    </motion.div>
  );
}
