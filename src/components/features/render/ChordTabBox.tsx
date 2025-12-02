import type { TabSix } from "./generateTabForChord";

interface ChordTabBoxProps {
    chord: string;
    tab: TabSix; // [E, A, D, G, B, e]
}

export default function ChordTabBox({ chord, tab }: ChordTabBoxProps) {
    const frets = tab
        .map(f => (f === "x" ? null : Number(f)))
        .filter(f => f !== null && f > 0) as number[];

    const minFret = frets.length ? Math.min(...frets) : 1;
    const startFret = minFret <= 1 ? 1 : minFret;
    // const displayFretLabel = startFret > 1;

    const normalized = tab.map(f => {
        if (f === "x" || f === "0") return f;
        return String(Number(f) - (startFret - 1));
    });

    return (
        <div className="bg-white/10 rounded-xl p-4 text-white flex flex-col items-center gap-2">
            <div className="text-lg font-bold text-center">{chord}</div>
            <div className="flex gap-2">
                <div className="flex flex-col items-center text-xs font-mono">
                    <div className="text-[10px] text-gray-300">{startFret}fr</div>
                    <svg
                        width="100%"
                        height="120"
                        viewBox="0 0 160 140"
                        preserveAspectRatio="xMidYMid meet"
                        style={{ minWidth: 120 }}
                    >
                        {[0, 1, 2, 3, 4, 5].map(i => (
                            <line
                                key={i}
                                x1={20 + i * 24}
                                y1={12}
                                x2={20 + i * 24}
                                y2={126}
                                stroke="#aaa"
                                strokeWidth="2"
                            />
                        ))}

                        {[0, 1, 2, 3].map(i => (
                            <line
                                key={i}
                                x1={20}
                                y1={12 + i * 28}
                                x2={140}
                                y2={12 + i * 28}
                                stroke={i === 0 && startFret === 1 ? "#fff" : "#666"}
                                strokeWidth={i === 0 && startFret === 1 ? "4" : "2"}
                            />
                        ))}

                        {normalized.map((f, index) => {
                            if (!f || f === "x" || f === "0") return null;
                            const fret = Number(f);
                            const fx = 20 + index * 24;
                            const fy = 12 + (fret - 0.5) * 28;
                            return <circle key={index} cx={fx} cy={fy} r={6} fill="white" />;
                        })}
                    </svg>
                </div>

                <div className="flex flex-col text-sm font-mono leading-[1.1rem]">
                    {["e", "B", "G", "D", "A", "E"].map((str, i) => (
                        <div key={i} className="flex gap-2">
                            <span className="text-gray-400">{str}|</span>
                            <span>{tab[i]}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
