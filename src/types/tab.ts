import type { TabComment } from "./community";

export interface TabItem {
  id: number;
  title: string;
  artist: string;
  instrument: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  date: string;
  shared?: boolean;
  rating?: number;
  comments?: TabComment[];
}