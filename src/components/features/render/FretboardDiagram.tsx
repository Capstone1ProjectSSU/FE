import type { TabSix } from "./generateTabForChord";

interface FretboardDiagramProps {
    tab: TabSix;
    chordName?: string;
    /** 보여줄 프렛 수 (세로 칸 수) */
    fretCount?: number; // default 4
    /** SVG width/height */
    width?: number;
    height?: number;
}

export default function FretboardDiagram({
    tab,
    chordName,
    fretCount = 4,
    width = 90,
    height = 120,
}: FretboardDiagramProps) {
    const frets = tab.map((f) => {
        if (f === "x") return null;
        const n = parseInt(f, 10);
        return Number.isNaN(n) ? null : n;
    });

    const usedFrets = frets.filter((f) => f !== null && f > 0) as number[];
    const minFret =
        usedFrets.length === 0 || Math.min(...usedFrets) <= 1 ? 0 : Math.min(...usedFrets);
    const maxFret = minFret + fretCount;

    const paddingX = 8;
    const paddingY = 18;
    const innerWidth = width - paddingX * 2;
    const innerHeight = height - paddingY * 2;

    const stringCount = 6;
    const stringGap = innerWidth / (stringCount - 1);
    const fretGap = innerHeight / fretCount;

    const yTop = paddingY;
    const yBottom = paddingY + innerHeight;

    const stringX = (index: number) => paddingX + index * stringGap;
    const fretY = (fretIndex: number) => paddingY + fretIndex * fretGap;

    return (
        <svg
            width={width}
            height={height}
            className="text-white"
            viewBox={`0 0 ${width} ${height}`}
        >
            {chordName && (
                <text
                    x={width / 2}
                    y={12}
                    textAnchor="middle"
                    className="fill-white"
                    fontSize={10}
                    fontWeight="bold"
                >
                    {chordName}
                </text>
            )}

            {frets.map((f, i) => {
                const x = stringX(i);
                const labelY = yTop - 6;

                const original = tab[i];
                if (original === "x") {
                    return (
                        <text
                            key={`xo-${i}`}
                            x={x}
                            y={labelY}
                            textAnchor="middle"
                            fontSize={9}
                            className="fill-gray-300"
                        >
                            x
                        </text>
                    );
                }
                if (f === 0) {
                    return (
                        <text
                            key={`xo-${i}`}
                            x={x}
                            y={labelY}
                            textAnchor="middle"
                            fontSize={9}
                            className="fill-gray-300"
                        >
                            o
                        </text>
                    );
                }
                return null;
            })}

            {Array.from({ length: stringCount }).map((_, i) => (
                <line
                    key={`string-${i}`}
                    x1={stringX(i)}
                    y1={yTop}
                    x2={stringX(i)}
                    y2={yBottom}
                    stroke="rgba(255,255,255,0.6)"
                    strokeWidth={0.8}
                />
            ))}

            {Array.from({ length: fretCount + 1 }).map((_, f) => {
                const y = fretY(f);
                const isNut = minFret === 0 && f === 0;
                return (
                    <line
                        key={`fret-${f}`}
                        x1={paddingX}
                        y1={y}
                        x2={paddingX + innerWidth}
                        y2={y}
                        stroke="rgba(255,255,255,0.8)"
                        strokeWidth={isNut ? 2 : 0.8}
                    />
                );
            })}

            {minFret > 0 && (
                <text
                    x={paddingX - 4}
                    y={fretY(1) + fretGap / 2}
                    textAnchor="end"
                    fontSize={9}
                    className="fill-gray-300"
                >
                    {minFret}
                </text>
            )}

            {frets.map((f, stringIndex) => {
                if (f === null || f === 0) return null;
                if (f < minFret || f > maxFret) return null;

                const x = stringX(stringIndex);
                const fretOffset = f - minFret;
                const y = fretY(fretOffset) + fretGap / 2;

                return (
                    <circle
                        key={`note-${stringIndex}`}
                        cx={x}
                        cy={y}
                        r={4}
                        fill="white"
                    />
                );
            })}
        </svg>
    );
}
