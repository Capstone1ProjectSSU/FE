import { createContext, useContext, useEffect, useState, useRef } from "react";
import type { ReactNode } from "react";
import type { TabItem } from "../types/tab";
import type { TabComment } from "../types/community";
import { useTabs } from "./TabContext";

interface CommunityContextType {
  sharedTabs: TabItem[];
  shareTab: (tab: TabItem) => void;
  addComment: (tabId: number, comment: TabComment) => void;
  rateTab: (tabId: number, stars: number) => void;
}

const CommunityContext = createContext<CommunityContextType | undefined>(undefined);

export function CommunityProvider({ children }: { children: ReactNode }) {
  const [sharedTabs, setSharedTabs] = useState<TabItem[]>(() => {
    const saved = localStorage.getItem("communityTabs");
    return saved ? JSON.parse(saved) : [];
  });

  const { updateTab } = useTabs();
  const pendingSharedTab = useRef<TabItem | null>(null); // ✅ 공유할 탭을 임시 저장

  /** ✅ 공유 함수 */
  const shareTab = (tab: TabItem) => {
    const alreadyShared = sharedTabs.some((t) => t.id === tab.id);
    if (alreadyShared) return;

    const sharedTab: TabItem = {
      ...tab,
      shared: true,
      rating: tab.rating ?? 0,
      comments: tab.comments ?? [],
    };

    const updated = [...sharedTabs, sharedTab];
    setSharedTabs(updated);

    // 🚫 바로 updateTab 호출하지 말고, 나중에 useEffect로 처리
    pendingSharedTab.current = sharedTab;
  };

  /** ✅ 렌더링 완료 후 MyTabs와 동기화 */
  useEffect(() => {
    if (pendingSharedTab.current) {
      updateTab(pendingSharedTab.current);
      pendingSharedTab.current = null;
    }
  }, [sharedTabs]); // sharedTabs 변경 직후 실행

  /** ✅ 댓글 추가 */
  const addComment = (tabId: number, comment: TabComment) => {
    setSharedTabs((prev) =>
      prev.map((t) =>
        t.id === tabId
          ? { ...t, comments: [...(t.comments ?? []), comment] }
          : t
      )
    );
  };

  /** ✅ 평점 추가 */
  const rateTab = (tabId: number, stars: number) => {
    setSharedTabs((prev) =>
      prev.map((t) => (t.id === tabId ? { ...t, rating: stars } : t))
    );
  };

  /** ✅ 로컬 스토리지 동기화 */
  useEffect(() => {
    localStorage.setItem("communityTabs", JSON.stringify(sharedTabs));
  }, [sharedTabs]);

  return (
    <CommunityContext.Provider value={{ sharedTabs, shareTab, addComment, rateTab }}>
      {children}
    </CommunityContext.Provider>
  );
}

export function useCommunity() {
  const context = useContext(CommunityContext);
  if (!context) {
    throw new Error("useCommunity must be used within a CommunityProvider");
  }
  return context;
}
