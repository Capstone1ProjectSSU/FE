export type InstrumentFilterKey = "GUITAR" | "BASS";
export type DifficultyFilterKey = "EASY" | "NORMAL" | "HARD";

export interface SheetFilters {
  instrument: Record<InstrumentFilterKey, boolean>;
  difficulty: Record<DifficultyFilterKey, boolean>;
}

export type PostSortKey =
  | "LATEST"
  | "OLDEST"
  | "HIGHEST_RATED"
  | "LOWEST_RATED";

export interface PostFilters {
  instrument: Record<InstrumentFilterKey, boolean>;
  difficulty: Record<DifficultyFilterKey, boolean>;
  sort: PostSortKey;
}

export const defaultPostFilters: PostFilters = {
  instrument: { GUITAR: true, BASS: true },
  difficulty: { EASY: true, NORMAL: true, HARD: true },
  sort: "LATEST",
};

