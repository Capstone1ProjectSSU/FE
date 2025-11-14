import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import DragDropZone from "./DragDropZone";
import FilePreview from "./FilePreview";
import { useTranscribe } from "../../../contexts/TranscribeContext";
import toast from "react-hot-toast";

export default function FileUploadPanel() {
  const { uploadAndRequest } = useTranscribe();

  const [file, setFile] = useState<File | null>(null);

  const [songTitle, setSongTitle] = useState("");
  const [artistName, setArtistName] = useState("");
  const [instrument, setInstrument] = useState<"GUITAR" | "BASS">("GUITAR");

  const handleFileSelect = (selected: File) => {
    setFile(selected);
    setSongTitle(selected.name.replace(".mp3", ""));
    setArtistName("");
  };

  const handleTranscribe = async (options: {
    instrument: "GUITAR" | "BASS";
    songTitle: string;
    artistName: string;
  }) => {
    if (!file) {
      toast.error("파일이 없습니다. 다시 업로드하세요.");
      return;
    }

    await uploadAndRequest(file, options);
    toast.success("🎧 Transcription started!");

    clearFile();
  };

  const clearFile = () => {
    setFile(null);
    setSongTitle("");
    setArtistName("");
    setInstrument("GUITAR");
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <AnimatePresence mode="wait">
        {!file ? (
          <motion.div
            key="drag"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <DragDropZone onFileSelect={handleFileSelect} />
          </motion.div>
        ) : (
          <motion.div
            key="preview"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="relative"
          >
            <FilePreview
              file={file}
              songTitle={songTitle}
              artistName={artistName}
              instrument={instrument}
              setSongTitle={setSongTitle}
              setArtistName={setArtistName}
              setInstrument={setInstrument}
              onTranscribe={handleTranscribe}
              onClear={clearFile}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
