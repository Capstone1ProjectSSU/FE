export type Difficulty = "EASY" | "NORMAL" | "HARD";
export type Instrument = "GUITAR" | "BASS" | "UKULELE";

export interface SheetBase {
  musicId: number;
  title: string;
  artist: string;
  difficulty: Difficulty;
  instrument: Instrument;
  createdAt: string;
  updatedAt: string;
  sheetDataUrl: string;
}

export interface SheetDetail extends SheetBase {
  tempo: number;
  capo: number;
  content: string; // 악보 TAB 문자열
}
