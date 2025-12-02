import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import DragDropZone from "./DragDropZone";
import FilePreview from "./FilePreview";
import toast from "react-hot-toast";
import { useTranscriptionFlow } from "../../../hooks/useTranscriptionFlow";
import { useTranscriptionHistory } from "../../../contexts/TranscriptionHistoryContext";

export default function FileUploadPanel() {
  const flow = useTranscriptionFlow();
  const history = useTranscriptionHistory();

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
    if (!file) return toast.error("파일 없음");

    try {
      const audioId = await flow.handleUpload(
        file,
        options.songTitle,
        options.artistName
      );

      const req = await flow.startTranscription(Number(audioId), options.instrument);

      history.updateJob({
        jobId: req.jobId,
        songTitle: options.songTitle,
        artistName: options.artistName,
      });

      toast.success("🎧 Transcription started!");

      flow.pollStatus(req.jobId);

      clearFile();
    } catch (err: any) {
      toast.error(err.message ?? "Transcription failed.");
    }
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
          <motion.div>
            <DragDropZone onFileSelect={handleFileSelect} />
          </motion.div>
        ) : (
          <motion.div>
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
