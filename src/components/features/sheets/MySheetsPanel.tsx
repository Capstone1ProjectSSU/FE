import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "../../common/Button";
import ModalPortal from "../../common/ModalPortal";
import Input from "../../common/Input";
import toast from "react-hot-toast";
import { extractErrorMessage } from "../../../utils/error";

import type { Instrument, Difficulty, SheetListItem } from "../../../types/sheet";
import type { SheetFilters, InstrumentFilterKey, DifficultyFilterKey } from "../../../types/filter";

import SheetCard from "./SheetCard";
import { getSheetList, updateSheet, deleteSheet } from "../../../services/SheetService";
import { shareSheet, unshareSheet } from "../../../services/PostService";

interface MySheetsPanelProps {
  filters: SheetFilters;
  onSelectTab: (sheet: SheetListItem) => void;
  onReadyRefresh?: (refreshFn: () => void) => void;
}

export default function MySheetsPanel({ filters, onSelectTab }: MySheetsPanelProps) {
  const [sheets, setSheets] = useState<SheetListItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [editSheet, setEditSheet] = useState<SheetListItem | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editArtist, setEditArtist] = useState("");
  const [editDifficulty, setEditDifficulty] = useState<Difficulty>("NORMAL");
  const [editInstrument, setEditInstrument] = useState<Instrument>("GUITAR");

  const [confirmDelete, setConfirmDelete] = useState<SheetListItem | null>(null);
  const [confirmShare, setConfirmShare] = useState<SheetListItem | null>(null);

  const fetchSheets = async () => {
    try {
      setLoading(true);
      const result = await getSheetList();
      if (result.ok) {
        setSheets(result.data.content);
      } else {
        toast.error(extractErrorMessage(result.error) || "악보 목록을 불러오지 못했어요.");
      }
    } catch (e) {
      console.error(e);
      toast.error("악보 목록 조회 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSheets();
  }, []);

  useEffect(() => {
    if (editSheet) {
      setEditTitle(editSheet.title);
      setEditArtist(editSheet.artist);
      setEditDifficulty(editSheet.difficulty);
      setEditInstrument(editSheet.instrument);
    }
  }, [editSheet]);

  const activeInstruments = Object.entries(filters.instrument)
    .filter(([, active]) => active)
    .map(([key]) => key) as InstrumentFilterKey[];

  const activeDifficulties = Object.entries(filters.difficulty)
    .filter(([, active]) => active)
    .map(([key]) => key) as DifficultyFilterKey[];

  const filteredSheets = sheets.filter((sheet) => {
    return (
      activeInstruments.includes(sheet.instrument) &&
      activeDifficulties.includes(sheet.difficulty)
    );
  });

  const handleShare = async () => {
    if (!confirmShare) return;

    try {
      let res;

      if (confirmShare.share === 1) {
        res = await unshareSheet(Number(confirmShare.sheetId));
      } else {
        res = await shareSheet(Number(confirmShare.sheetId));
      }

      if (!res.ok) {
        toast.error(extractErrorMessage(res.error) || "공유 상태 변경 실패");
        return;
      }

      await fetchSheets();

      toast.success(
        confirmShare.share === 1
          ? "🔒 공유가 해제되었습니다!"
          : "🔗 악보가 공유되었습니다!"
      );

      setConfirmShare(null);
    } catch (e) {
      console.error(e);
      toast.error("공유 상태 변경 중 오류가 발생했습니다.");
    }
  };

  const handleUpdate = async () => {
    if (!editSheet) return;

    try {
      const payload = {
        title: editTitle,
        artist: editArtist,
        instrument: editInstrument,
        difficulty: editDifficulty,
      };

      const res = await updateSheet(editSheet.sheetId, payload);

      if (!res.ok) {
        toast.error(extractErrorMessage(res.error) || "수정 실패");
        return;
      }

      await fetchSheets();

      toast.success("🎉 악보 정보가 수정되었습니다!");
      setEditSheet(null);
    } catch (e) {
      console.error(e);
      toast.error("수정 중 오류가 발생했습니다.");
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;

    try {
      const res = await deleteSheet(confirmDelete.sheetId);

      if (!res.ok) {
        toast.error(extractErrorMessage(res.error) || "삭제 실패");
        return;
      }

      await fetchSheets();

      toast.success("🗑️ 악보가 삭제되었습니다!");
      setConfirmDelete(null);
    } catch (e) {
      console.error(e);
      toast.error("삭제 중 오류가 발생했습니다.");
    }
  };

  if (loading) {
    return (
      <div className="text-gray-300 text-center py-20">Loading sheets...</div>
    );
  }

  if (sheets.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center text-gray-400 py-20 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-lg"
      >
        <p className="text-lg font-medium">아직 생성한 악보가 없습니다 🎶</p>
        <p className="text-sm mt-2 text-gray-500">
          transcription에서 악보를 생성해보세요!
        </p>
      </motion.div>
    );
  }

  if (filteredSheets.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center text-gray-400 py-12 bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl shadow-inner"
      >
        <p>No sheets available 🎼</p>
      </motion.div>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center text-center space-y-8 text-white mb-4"
      >
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
        >
          My Tabs
        </motion.h2>
        <p className="text-gray-400 max-w-xl">
          Upload your MP3, choose your instrument and difficulty,
          and watch progress in both the panel and sidebar.
        </p>
      </motion.div>

      {filteredSheets.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-gray-400 py-12 bg-white/10 backdrop-blur-lg 
                   border border-white/10 rounded-2xl shadow-inner"
        >
          <p className="font-medium text-gray-300">필터에 맞는 악보가 없습니다 🎼</p>
          <p className="text-sm text-gray-500 mt-2">
            생성한 악보가 존재하면 여기 표시됩니다.
          </p>
        </motion.div>
      ) : (
        <div className="w-full grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredSheets.map((sheet, idx) => (
            <SheetCard
              key={sheet.sheetId}
              sheet={sheet}
              idx={idx}
              onSelect={onSelectTab}
              onShare={setConfirmShare}
              onEdit={setEditSheet}
              onDelete={setConfirmDelete}
            />
          ))}
        </div>
      )}

      <AnimatePresence>
        {confirmDelete && (
          <ModalPortal>
            <motion.div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl 
                         p-8 w-80 text-center text-white shadow-lg"
              >
                <p className="mb-4">
                  정말{" "}
                  <span className="text-red-400 font-semibold">
                    {confirmDelete.title}
                  </span>
                  {" "}를 삭제하시겠습니까?
                </p>

                <div className="flex justify-between mt-6">
                  <Button
                    onClick={() => setConfirmDelete(null)}
                    variant="outline"
                    className="w-[48%]"
                  >
                    취소
                  </Button>

                  <Button
                    onClick={handleDelete}
                    variant="primary"
                    className="w-[48%] bg-red-600 hover:bg-red-500"
                  >
                    삭제
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          </ModalPortal>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {confirmShare && (
          <ModalPortal>
            <motion.div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl 
                     p-8 w-80 text-center text-white shadow-lg"
              >

                <p className="mb-4">
                  <span className="text-blue-300 font-semibold">
                    {confirmShare.title}
                  </span>
                  {" "}
                  를{" "}
                  {confirmShare.share === 1 ? (
                    <span className="text-red-400 font-semibold">공유 해제</span>
                  ) : (
                    <span className="text-green-300 font-semibold">공유</span>
                  )}
                  하시겠습니까?
                </p>

                <div className="flex justify-between mt-6">
                  <Button
                    onClick={() => setConfirmShare(null)}
                    variant="outline"
                    className="w-[48%]"
                  >
                    취소
                  </Button>

                  <Button
                    onClick={handleShare}
                    variant="primary"
                    className={`w-[48%] ${confirmShare.share === 1
                        ? "bg-red-600 hover:bg-red-500"
                        : "bg-green-600 hover:bg-green-500"
                      }`}
                  >
                    {confirmShare.share === 1 ? "공유 해제" : "공유"}
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          </ModalPortal>
        )}
      </AnimatePresence>


      <AnimatePresence>
        {editSheet && (
          <ModalPortal>
            <motion.div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl 
                         p-8 w-[420px] max-w-[95vw] text-white shadow-xl"
              >
                <h3 className="text-xl font-semibold mb-4 text-center">악보 수정</h3>

                <div className="space-y-4">
                  <Input
                    name="songTitle"
                    label="곡 제목"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                  />

                  <Input
                    name="artist"
                    label="아티스트명"
                    value={editArtist}
                    onChange={(e) => setEditArtist(e.target.value)}
                  />

                  <div>
                    <label className="text-sm text-gray-300 mb-2">악기</label>
                    <select
                      value={editInstrument}
                      onChange={(e) =>
                        setEditInstrument(e.target.value as Instrument)
                      }
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2"
                    >
                      <option value="GUITAR">Guitar</option>
                      <option value="BASS">Bass</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm text-gray-300 mb-2">난이도</label>
                    <select
                      value={editDifficulty}
                      onChange={(e) =>
                        setEditDifficulty(e.target.value as Difficulty)
                      }
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2"
                    >
                      <option value="EASY">EASY</option>
                      <option value="NORMAL">NORMAL</option>
                      <option value="HARD">HARD</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-between mt-6">
                  <Button
                    onClick={() => setEditSheet(null)}
                    variant="outline"
                    className="w-[48%]"
                  >
                    취소
                  </Button>

                  <Button
                    onClick={handleUpdate}
                    variant="primary"
                    className="w-[48%]"
                  >
                    저장
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          </ModalPortal>
        )}
      </AnimatePresence>
    </>
  );
}
