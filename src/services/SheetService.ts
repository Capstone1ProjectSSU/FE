import { request } from "./Client";
import type { SheetBase, SheetDetail, Difficulty, Instrument } from "../types/sheet";

export interface SheetQuery {
  keyword?: string;
  difficulty?: Difficulty;
  instrument?: Instrument;
  page?: number;
  size?: number;
  sort?: string;
  [key: string]: string | number | undefined;
}

export const getSheets = async () => {
  const res = await request<any>("/sheets");
  return res.data.content;
};

// 3️⃣ 상세 조회
export const getSheetDetail = async (musicId: number) => {
  const res = await request<any>(`/sheets/${musicId}`);
  return res.data;
};

// 4️⃣ 수정 (PUT)
export const updateSheet = (
  musicId: number,
  body: Partial<Pick<SheetDetail, "title" | "difficulty" | "tempo" | "capo">>
) =>
  request<SheetDetail>(`/sheets/${musicId}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });

// 5️⃣ 삭제
export const deleteSheet = (musicId: number) =>
  request<void>(`/sheets/${musicId}`, {
    method: "DELETE",
  });
