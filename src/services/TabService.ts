export interface SavedTab {
  id: number;
  title: string;
  difficulty: string;
  instrument: string;
  date: string;
  content: string;
}

export interface TabData {
  id?: number;
  content: string;
  difficulty?: string;
}

export const saveTab = (
  songTitle: string,
  artistName: string,
  tabData: TabData
): SavedTab => {
  const newTab: SavedTab = {
    id: Date.now(),
    title: `${songTitle} - ${artistName}`,
    difficulty: tabData.difficulty || "Intermediate",
    instrument: "Guitar",
    date: new Date().toISOString().split("T")[0],
    content: tabData.content,
  };

  const existing = JSON.parse(localStorage.getItem("myTabs") || "[]");
  existing.push(newTab);
  localStorage.setItem("myTabs", JSON.stringify(existing));

  return newTab;
};

export const getSavedTabs = (): SavedTab[] => {
  return JSON.parse(localStorage.getItem("myTabs") || "[]");
};
