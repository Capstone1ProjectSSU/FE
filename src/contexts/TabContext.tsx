import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

export interface TabItem {
  id: number;
  title: string;
  instrument: string;
  difficulty: string;
  date: string;
}

interface TabContextType {
  tabs: TabItem[];
  addTab: (tab: Omit<TabItem, "id" | "date">) => void;
  updateTab: (updatedTab: TabItem) => void; // ✅ 추가
  deleteTab: (id: number) => void; // ✅ 추가 (removeTab 대체)
  removeTab: (id: number) => void; // 🔄 남겨도 무방 (하위 호환용)
}

const TabContext = createContext<TabContextType | undefined>(undefined);

export function TabProvider({ children }: { children: ReactNode }) {
  const [tabs, setTabs] = useState<TabItem[]>(() => {
    const saved = localStorage.getItem("myTabs");
    return saved ? JSON.parse(saved) : [];
  });

  /** ✅ 새 TAB 추가 */
  const addTab = (tab: Omit<TabItem, "id" | "date">) => {
    const newTab: TabItem = {
      ...tab,
      id: Date.now(),
      date: new Date().toISOString().split("T")[0],
    };
    const updated = [...tabs, newTab];
    setTabs(updated);
    localStorage.setItem("myTabs", JSON.stringify(updated));
  };

  /** ✅ TAB 수정 */
  const updateTab = (updatedTab: TabItem) => {
    const updated = tabs.map((tab) =>
      tab.id === updatedTab.id ? updatedTab : tab
    );
    setTabs(updated);
    localStorage.setItem("myTabs", JSON.stringify(updated));
  };

  /** ✅ TAB 삭제 */
  const deleteTab = (id: number) => {
    const updated = tabs.filter((tab) => tab.id !== id);
    setTabs(updated);
    localStorage.setItem("myTabs", JSON.stringify(updated));
  };

  /** (하위 호환용) removeTab alias */
  const removeTab = deleteTab;

  return (
    <TabContext.Provider
      value={{
        tabs,
        addTab,
        updateTab,
        deleteTab,
        removeTab,
      }}
    >
      {children}
    </TabContext.Provider>
  );
}

/** ✅ Hook */
export function useTab() {
  const context = useContext(TabContext);
  if (!context)
    throw new Error("useTab must be used within a TabProvider");
  return context;
}
