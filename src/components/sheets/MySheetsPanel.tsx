import SheetList from "./SheetList";
import { useSheets } from "../../contexts/SheetContext";
import type { SheetBase } from "../../types/sheet";
import type { SheetFilters, InstrumentFilterKey, DifficultyFilterKey } from "../../types/filter";

interface MySheetsPanelProps {
  filters: SheetFilters;
  onSelectTab: (sheet: SheetBase) => void;
}

export default function MySheetsPanel({ filters, onSelectTab }: MySheetsPanelProps) {
  const { sheets } = useSheets();

  // 활성화된 Instrument 값
  const activeInstruments = (Object.entries(filters.instrument)
    .filter(([_, active]) => active)
    .map(([key]) => key)) as InstrumentFilterKey[];

  // 활성화된 Difficulty 값
  const activeDifficulties = (Object.entries(filters.difficulty)
    .filter(([_, active]) => active)
    .map(([key]) => key)) as DifficultyFilterKey[];

  // 필터링 로직
  const filteredSheets = sheets.filter((sheet) => {
    const instrumentMatch = activeInstruments.includes(sheet.instrument);
    const difficultyMatch = activeDifficulties.includes(sheet.difficulty);
    return instrumentMatch && difficultyMatch;
  });

  return (
    <div className="w-full">
      <SheetList sheetsOverride={filteredSheets} onSelectSheet={onSelectTab} />
    </div>
  );
}
