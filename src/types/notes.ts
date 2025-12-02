// notes.ts
export const NOTES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

// 기본 튜닝
export const STANDARD_TUNING = ["E", "A", "D", "G", "B", "E"];

// 프렛보드: 각 줄 → 각 프렛 → 음
export function generateFretboard(tuning: string[], frets = 15) {
    return tuning.map((open) => {
        const startIndex = NOTES.indexOf(open);
        return Array.from({ length: frets }, (_, f) =>
            NOTES[(startIndex + f) % 12]
        );
    });
}
