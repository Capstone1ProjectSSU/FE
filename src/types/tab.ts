export interface Tab {
  id: number;
  title: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  instrument: string;
  date: string; // ISO 또는 YYYY-MM-DD
}
