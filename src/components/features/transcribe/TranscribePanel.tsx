import FileUploadPanel from "./FileUploadPanel";
import { motion } from "framer-motion";

export default function TranscribePanel() {
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
        Upload your audio, choose your instrument, and send it to our AI transcription engine.
      </p>
      <FileUploadPanel />
    </motion.div>
  );
}
