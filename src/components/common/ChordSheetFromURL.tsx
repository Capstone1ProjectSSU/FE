import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { generateTabForChord } from "../features/render/generateTabForChord";
import ChordTabBox from "../features/render/ChordTabBox";

interface AIChord {
  symbol: string;
  duration: number;
}

interface AIChordData {
  key: string;
  chords: AIChord[];
}

type TimelineItem =
  | { type: "chord"; start: number; duration: number; name: string }
  | { type: "rest"; start: number; duration: number };

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export default function ChordSheetFromURL({ url }: { url: string }) {
  const [bars, setBars] = useState<TimelineItem[][]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [songKey, setSongKey] = useState<string | null>(null);

  const [barsPerPage, setBarsPerPage] = useState(2);
  const [currentPage, setCurrentPage] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(API_BASE_URL + url);
        if (!res.ok) {
          throw new Error(`Failed to fetch chord JSON: ${res.status}`);
        }

        const raw: AIChordData = await res.json();

        setSongKey(raw.key ?? null);

        const timeline: TimelineItem[] = [];
        let start = 0;

        for (const chord of raw.chords) {
          const dur = chord.duration || 1;

          timeline.push({
            type: "chord",
            start,
            duration: dur,
            name: chord.symbol,
          });

          start += dur;
        }
        const barLength = 4;
        const grouped: TimelineItem[][] = [];

        for (const item of timeline) {
          const barIdx = Math.floor(item.start / barLength);
          if (!grouped[barIdx]) grouped[barIdx] = [];
          grouped[barIdx].push(item);
        }

        setBars(grouped);
      } catch (e: any) {
        console.error(e);
        setError(e?.message ?? "Failed to load chord sheet.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [url]);

  if (loading) {
    return <p className="text-gray-300">Loading chords...</p>;
  }

  if (error) {
    return <p className="text-red-400 text-sm">Error: {error}</p>;
  }

  if (!bars.length) {
    return <p className="text-gray-300">No chords to display.</p>;
  }

  const maxPage = Math.ceil(bars.length / barsPerPage) - 1;
  const offset = currentPage * barsPerPage;
  const currentBars = bars.slice(offset, offset + barsPerPage);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0,
      position: "absolute" as const,
    }),
    center: {
      x: 0,
      opacity: 1,
      position: "static" as const,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 50 : -50,
      opacity: 0,
      position: "absolute" as const,
    }),
  };

  const goNext = () => {
    if (currentPage < maxPage) {
      setDirection(1);
      setCurrentPage((p) => p + 1);
    }
  };

  const goPrev = () => {
    if (currentPage > 0) {
      setDirection(-1);
      setCurrentPage((p) => p - 1);
    }
  };

  return (
    <div className="relative w-full mt-4 flex flex-col items-center gap-6">
      <div className="flex items-center justify-between w-full max-w-[900px] bg-white/5 px-4 py-3 rounded-xl border border-white/10">
        <div className="flex items-center justify-center gap-4">
          <div className="text-gray-200 text-sm">
            {songKey && (
              <>
                Key: <span className="font-semibold">{songKey}</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-300 text-sm">Bars/Page</span>
            <select
              className="bg-white/10 px-2 py-1 rounded text-sm"
              value={barsPerPage}
              onChange={(e) => {
                setBarsPerPage(Number(e.target.value));
                setCurrentPage(0);
              }}
            >
              <option value={2}>2</option>
              <option value={3}>3</option>
              <option value={4}>4</option>
            </select>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {currentPage > 0 && (
            <button
              onClick={goPrev}
              className="text-l text-white/60 hover:text-white transition"
            >
              &lt;
            </button>
          )}
          <div className="text-gray-300 text-sm text-centers">
            Page {currentPage + 1} / {maxPage + 1}
          </div>
          {currentPage < maxPage && (
            <button
              onClick={goNext}
              className="text-l text-white/60 hover:text-white transition"
            >
              &gt;
            </button>
          )}

        </div>
      </div>

      <div className="relative min-h-[200px] w-full max-w-[900px] overflow-hidden">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentPage}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35 }}
            className="flex flex-col gap-6"
          >
            {currentBars.map((bar, i) => {
              const total = bar.reduce((s, x) => s + x.duration, 0);

              return (
                <div
                  key={i}
                  className="bg-white/10 border border-white/20 rounded-xl p-4 flex flex-col gap-3"
                >
                  <div className="flex gap-2 opacity-90">
                    {bar.map((item, idx) => {
                      const pct = (item.duration / total) * 100;

                      if (item.type === "rest") {
                        return (
                          <div
                            key={idx}
                            style={{ width: `${pct}%` }}
                            className="border border-dashed border-white/30 rounded flex items-center justify-center text-xs text-white/40"
                          >
                            (rest)
                          </div>
                        );
                      }

                      const tab = generateTabForChord(item.name);

                      return (
                        <div key={idx} style={{ width: `${pct}%` }}>
                          <ChordTabBox chord={item.name} tab={tab} />
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
