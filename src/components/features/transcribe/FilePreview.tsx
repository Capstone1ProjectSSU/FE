import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faFileAudio,
  faWandMagicSparkles,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import Button from "../../common/Button";
import { useState } from "react";

interface FilePreviewProps {
  file: File;
  songTitle: string;
  artistName: string;
  instrument: "GUITAR" | "BASS";

  setSongTitle: React.Dispatch<React.SetStateAction<string>>;
  setArtistName: React.Dispatch<React.SetStateAction<string>>;
  setInstrument: React.Dispatch<React.SetStateAction<"GUITAR" | "BASS">>;

  onTranscribe: (options: {
    songTitle: string;
    artistName: string;
    instrument: "GUITAR" | "BASS";
  }) => void;

  onClear: () => void;
}

export default function FilePreview({ file, onTranscribe, onClear }: FilePreviewProps) {
  const [songTitle, setSongTitle] = useState(file.name.replace(".mp3", ""));
  const [artistName, setArtistName] = useState("");
  const [instrument, setInstrument] = useState<"GUITAR" | "BASS">("GUITAR");

  const handlePlay = () => {
    const audio = new Audio(URL.createObjectURL(file));
    audio.play();
  };

  const handleSubmit = () => {
    onTranscribe({
      instrument,
      songTitle,
      artistName,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-lg transition-all duration-300"
    >
      {onClear && (
        <button
          onClick={onClear}
          className="absolute top-4 right-4 text-gray-400 hover:text-red-400 transition"
        >
          <FontAwesomeIcon icon={faXmark} className="w-4 h-4" />
        </button>
      )}

      <div className="flex items-center gap-4 text-white mb-6">
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

      <div className="space-y-5 mb-6">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-200 flex items-center gap-2">
            Song Title
          </label>
          <input
            value={songTitle}
            onChange={(e) => setSongTitle(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-400/40 focus:outline-none"
            placeholder="Enter song title..."
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-200 flex items-center gap-2">
            Artist Name
          </label>
          <input
            value={artistName}
            onChange={(e) => setArtistName(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-400/40 focus:outline-none"
            placeholder="Enter artist name..."
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-200 flex items-center gap-2">
            Instrument
          </label>

          <div className="flex bg-white/5 border border-white/10 rounded-xl p-1">
            {["GUITAR", "BASS"].map((v) => (
              <button
                key={v}
                onClick={() => setInstrument(v as "GUITAR" | "BASS")}
                className={`flex-1 py-2 rounded-lg transition-all text-sm ${instrument === v
                  ? "bg-blue-500 text-white shadow-md"
                  : "text-gray-300 hover:bg-white/10"
                  }`}
              >
                {v === "GUITAR" ? "Guitar" : "Bass"}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <button
          onClick={handlePlay}
          className="flex items-center gap-2 text-gray-300 hover:text-blue-400 transition-colors"
        >
          <FontAwesomeIcon icon={faPlay} />
          <span>Preview Audio</span>
        </button>

        <Button
          onClick={handleSubmit}
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
