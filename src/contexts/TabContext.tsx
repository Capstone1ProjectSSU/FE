import { createContext, useContext, useEffect, useState } from "react";
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
}

const TabContext = createContext<TabContextType | undefined>(undefined);

export function TabProvider({ children }: { children: ReactNode }) {
  const [tabs, setTabs] = useState<TabItem[]>(() => {
    const saved = localStorage.getItem("myTabs");
    return saved ? JSON.parse(saved) : [];
  });

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

  useEffect(() => {
    localStorage.setItem("myTabs", JSON.stringify(tabs));
  }, [tabs]);

  return (
    <TabContext.Provider value={{ tabs, addTab }}>
      {children}
    </TabContext.Provider>
  );
}

export function useTab() {
  const context = useContext(TabContext);
  if (!context) throw new Error("useTab must be used within a TabProvider");
  return context;
}
