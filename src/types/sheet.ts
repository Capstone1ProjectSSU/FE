export type Difficulty = "EASY" | "NORMAL" | "HARD";
export type Instrument = "GUITAR" | "BASS";

// GET /api/sheets 리스트 아이템
export interface SheetListItem {
  sheetId: string;
  title: string;
  artist: string;
  instrument: Instrument;
  difficulty: Difficulty;
  share: number;        // 0 | 1
  createdAt: string;
}

// Pageable 정보
export interface PageableInfo {
  page: number;
  size: number;
  sort: string;
}

// GET /api/sheets Response Data
export interface SheetListData {
  content: SheetListItem[];
  pageable: PageableInfo;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

// GET /api/sheets/{sheet_id}
export interface SheetDetail {
  sheetId: string;
  title: string;
  artist: string;
  instrument: Instrument;
  difficulty: Difficulty;
  key: string;
  audioUrl: string;
  sheetDataUrl: string;
  share: number;        // 0 | 1
  createdAt: string;
  updatedAt: string;
}

// PUT RequestBody
export interface SheetUpdatePayload {
  title: string;
  artist: string;
  difficulty: Difficulty;
  instrument: Instrument;
  key?: string;
}

export interface SheetUpdateResponse {
  sheetId: string;
  title: string;
  artist: string;
  instrument: Instrument;
  difficulty: Difficulty;
  key: string;
  audioUrl: string;
  sheetDataUrl: string;
  createdAt: string;
  updatedAt: string;
}
