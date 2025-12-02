export type TabSix = [string, string, string, string, string, string];

const OPEN_CHORDS: Record<string, TabSix> = {
    C: ["x", "3", "2", "0", "1", "0"],
    Cmaj7: ["x", "3", "2", "0", "0", "0"],
    C7: ["x", "3", "2", "3", "1", "0"],

    D: ["x", "x", "0", "2", "3", "2"],
    Dmaj7: ["x", "x", "0", "2", "2", "2"],
    D7: ["x", "x", "0", "2", "1", "2"],

    E: ["0", "2", "2", "1", "0", "0"],
    Emaj7: ["0", "2", "1", "1", "0", "0"],
    E7: ["0", "2", "0", "1", "0", "0"],

    F: ["1", "3", "3", "2", "1", "1"],
    Fmaj7: ["1", "3", "3", "2", "1", "0"],
    F7: ["1", "3", "1", "2", "1", "1"],

    G: ["3", "2", "0", "0", "0", "3"],
    Gmaj7: ["3", "2", "0", "0", "0", "2"],
    G7: ["3", "2", "0", "0", "0", "1"],

    A: ["x", "0", "2", "2", "2", "0"],
    Amaj7: ["x", "0", "2", "1", "2", "0"],
    A7: ["x", "0", "2", "0", "2", "0"],

    B: ["x", "2", "4", "4", "4", "2"],
    Bmaj7: ["x", "2", "4", "3", "4", "2"],
    B7: ["x", "2", "1", "2", "0", "2"],


    // ===== Minor =====
    Am: ["x", "0", "2", "2", "1", "0"],
    Am7: ["x", "0", "2", "0", "1", "0"],

    Dm: ["x", "x", "0", "2", "3", "1"],
    Dm7: ["x", "x", "0", "2", "1", "1"],

    Em: ["0", "2", "2", "0", "0", "0"],
    Em7: ["0", "2", "2", "0", "3", "0"],

    Fm: ["1", "3", "3", "1", "1", "1"],
    Fm7: ["1", "3", "3", "1", "4", "1"],

    Gm: ["3", "5", "5", "3", "3", "3"],
    Gm7: ["3", "5", "3", "3", "3", "3"],

    Bm: ["x", "2", "4", "4", "3", "2"],
    Bm7: ["x", "2", "4", "2", "3", "2"],

    "F#m": ["2", "4", "4", "2", "2", "2"],
    "F#m7": ["2", "4", "2", "2", "2", "2"],
    "G#m": ["4", "6", "6", "4", "4", "4"],
    "G#m7": ["4", "6", "4", "4", "4", "4"],


    // ===== Sus & Add =====
    Dsus2: ["x", "x", "0", "2", "3", "0"],
    Dsus4: ["x", "x", "0", "2", "3", "3"],
    Asus2: ["x", "0", "2", "2", "0", "0"],
    Asus4: ["x", "0", "2", "2", "3", "0"],
    Esus2: ["0", "2", "4", "4", "0", "0"],
    Esus4: ["0", "2", "2", "2", "0", "0"],
    Gsus4: ["3", "5", "5", "5", "3", "3"],
    Bsus4: ["x", "2", "4", "4", "5", "2"],

    Cadd9: ["x", "3", "2", "0", "3", "0"],
    Gadd9: ["3", "2", "0", "0", "0", "2"],
    Aadd9: ["x", "0", "2", "1", "0", "0"],


    // ===== Augmented (증가화음) =====
    Aaug: ["x", "0", "3", "2", "2", "1"],
    Eaug: ["0", "3", "2", "1", "1", "0"],
    Daug: ["x", "x", "1", "2", "3", "x"],
    Caug: ["x", "3", "2", "1", "1", "0"],
    Gaug: ["3", "2", "1", "0", "0", "3"],
    "G#aug": ["4", "5", "5", "5", "4", "4"],
    "F#aug": ["2", "3", "3", "3", "2", "2"],


    // ===== Dim & Dim7 =====
    Bdim: ["x", "2", "3", "1", "3", "1"],
    Fdim: ["1", "2", "3", "1", "3", "1"],
    Adim: ["5", "6", "7", "5", "7", "5"],
    "C#dim": ["x", "4", "5", "3", "5", "3"],
    "D#dim": ["x", "6", "7", "5", "7", "5"],
    "G#dim": ["4", "5", "6", "4", "6", "4"],

    // Dim7 (실전에서 dim = dim7 취급)
    Cdim7: ["x", "3", "4", "2", "4", "2"],
    Ddim7: ["x", "5", "6", "4", "6", "4"],
    Edim7: ["x", "7", "8", "6", "8", "6"],

    // ===== 추가 =====
    Fsus2: ["1", "3", "3", "0", "1", "1"],
};

const SLASH_CHORDS: Record<string, TabSix> = {

    "Am/C": ["x", "3", "2", "2", "1", "0"],
    "Am/E": ["0", "0", "2", "2", "1", "0"],

    "C/G": ["3", "3", "2", "0", "1", "0"],
    "C/E": ["0", "3", "2", "0", "1", "0"],

    "D/F#": ["2", "x", "0", "2", "3", "2"],
    "D/A": ["x", "0", "0", "2", "3", "2"],

    "Em/G": ["3", "2", "2", "0", "0", "0"],
    "Em/B": ["x", "2", "2", "0", "0", "0"],
    "Em7/B": ["x", "2", "2", "0", "3", "0"],

    "G/B": ["x", "2", "0", "0", "0", "3"],
    "G/D": ["x", "x", "0", "0", "0", "3"],

    "E/G#": ["4", "2", "2", "1", "0", "0"],
    "G#m/B": ["x", "2", "1", "1", "0", "4"],

    "Dm/A": ["x", "0", "0", "2", "3", "1"],
    "Dm/C": ["x", "3", "0", "2", "3", "1"],
    "Dm7/C": ["x", "3", "0", "2", "1", "1"],

    "G9/F": ["1", "x", "0", "0", "1", "1"],

    "C#m/E": ["0", "2", "2", "1", "0", "0"],

    // 추가 Slash 필수 세트
    "A/C#": ["x", "4", "2", "2", "2", "0"],
    "A/E": ["0", "0", "2", "2", "2", "0"],
    "F/C": ["x", "3", "3", "2", "1", "1"],
    "F/A": ["x", "0", "3", "2", "1", "1"],

    "E/B": ["x", "2", "2", "1", "0", "0"],
    "E/D#": ["x", "6", "1", "1", "0", "0"],

    "G/F#": ["2", "x", "0", "0", "0", "3"],
    "G/F": ["1", "x", "0", "0", "0", "3"],

    "B/F#": ["2", "2", "4", "4", "4", "2"],
};

function makeBarreChord(rootFret: number, type: "M" | "m"): TabSix {
    if (type === "M") {
        return [
            String(rootFret),
            String(rootFret + 2),
            String(rootFret + 2),
            String(rootFret + 1),
            String(rootFret),
            String(rootFret),
        ];
    }
    return [
        String(rootFret),
        String(rootFret + 2),
        String(rootFret + 2),
        String(rootFret),
        String(rootFret),
        String(rootFret),
    ];
}

const BARRE_ROOTS: Record<string, number> = {
    "F#": 2,
    "G": 3,
    "G#": 4,
    "A": 5,
    "A#": 6,
    "B": 7,
    "C": 8,
    "C#": 9,
    "D": 10,
    "D#": 11,
    "E": 12,
};


function parseSlash(chord: string): { base: string; bass: string } | null {
    if (!chord.includes("/")) return null;
    const [base, bass] = chord.split("/");
    return { base, bass };
}

function fallbackVoicing(_chord: string): TabSix {
    // simple fallback: all strings muted
    return ["x", "x", "x", "x", "x", "x"];
}

export function generateTabForChord(symbol: string): TabSix {
    const chord = symbol.trim();

    // 1) Slash chord dictionary (정의된 것만 정확하게 사용)
    if (SLASH_CHORDS[chord]) return SLASH_CHORDS[chord];

    // 2) Open chord dictionary
    if (OPEN_CHORDS[chord]) return OPEN_CHORDS[chord];

    // 3) Slash chord 처리 (안전 모드)
    const slash = parseSlash(chord);
    if (slash) {
        const { base, bass } = slash;

        // base voicing 찾기
        const baseShape =
            OPEN_CHORDS[base] ||
            fallbackVoicing(base);

        if (baseShape.every(s => s === "x")) {
            // base chord를 모른다면 슬래시는 수행하지 않는다
            return baseShape;
        }

        // bass note가 가능한 개방현(E, A, D)이면 적용
        const OPEN_BASS_FRET: Record<string, string> = {
            E: "0",
            A: "x", // A/E 형태 방지용 → 그대로 base
            D: "x",
        };

        if (OPEN_BASS_FRET[bass] !== undefined) {
            const bassFret = OPEN_BASS_FRET[bass];

            return [
                bassFret,
                baseShape[1],
                baseShape[2],
                baseShape[3],
                baseShape[4],
                baseShape[5],
            ];
        }

        return baseShape;
    }

    // 4) Barre chord detection
    const root = chord.replace(/[^A-G#]/g, "");
    if (BARRE_ROOTS[root]) {
        const rootFret = BARRE_ROOTS[root];
        const isMinor = chord.includes("m") && !chord.includes("maj");
        return makeBarreChord(rootFret, isMinor ? "m" : "M");
    }

    // 5) Final fallback
    return fallbackVoicing(chord);
}
