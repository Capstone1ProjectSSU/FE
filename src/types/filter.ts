export type InstrumentFilterKey = "GUITAR" | "BASS" | "UKULELE";
export type DifficultyFilterKey = "EASY" | "NORMAL" | "HARD";

export interface SheetFilters {
  instrument: Record<InstrumentFilterKey, boolean>;
  difficulty: Record<DifficultyFilterKey, boolean>;
}
