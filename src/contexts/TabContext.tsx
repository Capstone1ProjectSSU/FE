import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import type { TabItem } from "../types/tab";

interface TabContextType {
  tabs: TabItem[];
  addTab: (tab: Omit<TabItem, "id" | "date">) => void;
  updateTab: (updated: TabItem) => void;
  deleteTab: (id: number) => void; // ✅ 명시적 삭제 함수
}

const TabContext = createContext<TabContextType | undefined>(undefined);

export function TabProvider({ children }: { children: ReactNode }) {
  const [tabs, setTabs] = useState<TabItem[]>(() => {
    const saved = localStorage.getItem("myTabs");
    return saved ? JSON.parse(saved) : [];
  });

  /** ✅ 새 탭 추가 */
  const addTab = (tab: Omit<TabItem, "id" | "date">) => {
    const newTab: TabItem = {
      id: Date.now(),
      date: new Date().toLocaleString(),
      ...tab,
    };
    const updated = [...tabs, newTab];
    setTabs(updated);
    localStorage.setItem("myTabs", JSON.stringify(updated));
  };

  /** ✅ 탭 수정 */
  const updateTab = (updated: TabItem) => {
    const updatedTabs = tabs.map((t) => (t.id === updated.id ? updated : t));
    setTabs(updatedTabs);
    localStorage.setItem("myTabs", JSON.stringify(updatedTabs));
  };

  /** ✅ 탭 삭제 */
  const deleteTab = (id: number) => {
    const updatedTabs = tabs.filter((t) => t.id !== id);
    setTabs(updatedTabs);
    localStorage.setItem("myTabs", JSON.stringify(updatedTabs));
  };

  return (
    <TabContext.Provider value={{ tabs, addTab, updateTab, deleteTab }}>
      {children}
    </TabContext.Provider>
  );
}

/** ✅ Context Hook */
export function useTabs() {
  const context = useContext(TabContext);
  if (!context) {
    throw new Error("useTabs must be used within a TabProvider");
  }
  return context;
}
