// src/contexts/SheetContext.tsx
import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { getSheets, deleteSheet, updateSheet } from "../services/SheetService";
import type { SheetBase } from "../types/sheet";

interface SheetContextType {
  sheets: SheetBase[];
  reload: () => void;
  remove: (musicId: number) => Promise<void>;
  edit: (
    data: Partial<SheetBase> & { musicId: number }
  ) => Promise<void>;
}

const SheetContext = createContext<SheetContextType | undefined>(undefined);

export function SheetProvider({ children }: { children: ReactNode }) {
  const [sheets, setSheets] = useState<SheetBase[]>([]);

  const reload = async () => {
    const data = await getSheets();
    setSheets(data);
  };

  const remove = async (musicId: number) => {
    await deleteSheet(musicId);
    setSheets((prev) => prev.filter((s) => s.musicId !== musicId));
  };

  const edit = async (
    data: Partial<SheetBase> & { musicId: number }
  ) => {
    const updated = await updateSheet(data.musicId, data);
    setSheets((prev) =>
      prev.map((s) => (s.musicId === updated.musicId ? updated : s))
    );
  };

  useEffect(() => {
    reload();
  }, []);

  return (
    <SheetContext.Provider value={{ sheets, reload, remove, edit }}>
      {children}
    </SheetContext.Provider>
  );
}

export const useSheets = () => {
  const ctx = useContext(SheetContext);
  if (!ctx) throw new Error("useSheets must be used inside SheetProvider");
  return ctx;
};
