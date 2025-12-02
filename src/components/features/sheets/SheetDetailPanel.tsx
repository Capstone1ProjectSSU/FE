import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "../../common/Button";
import ModalPortal from "../../common/ModalPortal";
import Input from "../../common/Input";
import toast from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faShare } from "@fortawesome/free-solid-svg-icons";
import { extractErrorMessage } from "../../../utils/error";

import { getSheetDetail, updateSheet, deleteSheet } from "../../../services/SheetService";
import type { SheetDetail, Instrument, Difficulty } from "../../../types/sheet";
import ChordSheetFromURL from "../../common/ChordSheetFromURL";
import { shareSheet, unshareSheet } from "../../../services/PostService";

import { useDifficultyFlow } from "../../../hooks/useDifficultyFlow";

export type SheetDetailPanelSheet = {
  sheetId?: string;
  title: string;
  artist: string;
  instrument: Instrument;
  difficulty: Difficulty;
  sheetDataUrl?: string;
  share?: number;
  isPreview?: boolean;
};

interface SheetDetailPanelProps {
  sheet: SheetDetailPanelSheet;
  onBack: () => void;
  onRefresh: () => void;
}

export default function SheetDetailPanel({ sheet, onBack, onRefresh }: SheetDetailPanelProps) {
  const isPreview = sheet.isPreview === true;

  const [detail, setDetail] = useState<SheetDetail | null>(null);
  const [loading, setLoading] = useState(true);

  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [editTitle, setEditTitle] = useState(sheet.title);
  const [editArtist, setEditArtist] = useState(sheet.artist);
  const [editDifficulty, setEditDifficulty] = useState<Difficulty>(sheet.difficulty);
  const [editInstrument, setEditInstrument] = useState<Instrument>(sheet.instrument);

  const difficultyFlow = useDifficultyFlow();
  const [openMore, setOpenMore] = useState(false);

  useEffect(() => {
    setEditTitle(sheet.title);
    setEditArtist(sheet.artist);
    setEditDifficulty(sheet.difficulty);
    setEditInstrument(sheet.instrument);
  }, [sheet]);

  useEffect(() => {
    const loadDetail = async () => {
      try {
        setLoading(true);
        if (isPreview) {
          const detailData: SheetDetail = {
            sheetId: sheet.sheetId ?? "",
            title: sheet.title,
            artist: sheet.artist,
            instrument: sheet.instrument,
            difficulty: sheet.difficulty,
            key: "",
            audioUrl: "",
            sheetDataUrl: sheet.sheetDataUrl ?? "",
            share: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          setDetail(detailData);
          return;
        }

        if (!sheet.sheetId) {
          toast.error("sheetId 가 없습니다.");
          return;
        }

        const result = await getSheetDetail(sheet.sheetId);

        if (!result.ok) {
          toast.error("악보 정보를 불러오지 못했습니다.");
          return;
        }

        setDetail(result.data);
      } catch (e) {
        console.error("Detail load error:", e);
        toast.error("악보 데이터를 불러올 수 없습니다.");
      } finally {
        setLoading(false);
      }
    };

    loadDetail();
  }, [sheet, isPreview]);


  if (loading) {
    return (
      <div className="text-center text-gray-400 py-10">Loading...</div>
    );
  }

  if (!detail) {
    return (
      <div className="text-center text-red-400 py-10">
        악보 정보를 불러오지 못했습니다.
      </div>
    );
  }

  const handleSaveEdit = async () => {
    if (isPreview) {
      toast.error("Preview 상태에서는 수정할 수 없습니다.");
      return;
    }

    try {
      const payload = {
        title: editTitle,
        artist: editArtist,
        instrument: editInstrument,
        difficulty: editDifficulty,
      };

      const res = await updateSheet(detail!.sheetId, payload);

      if (!res.ok) {
        toast.error(extractErrorMessage(res.error) || "수정 실패");
        return;
      }

      setDetail(prev =>
        prev
          ? {
            ...prev,
            title: editTitle,
            artist: editArtist,
            instrument: editInstrument,
            difficulty: editDifficulty,
          }
          : prev
      );

      toast.success("🎉 악보 정보가 수정되었습니다!");
      setShowEditModal(false);

      onRefresh();
    } catch (e) {
      console.error(e);
      toast.error("수정 중 오류가 발생했습니다.");
    }
  };


  const handleDelete = async () => {
    if (isPreview) {
      toast.error("Preview 상태에서는 삭제할 수 없습니다.");
      return;
    }

    try {
      const res = await deleteSheet(detail!.sheetId);

      if (!res.ok) {
        toast.error(extractErrorMessage(res.error) || "삭제 실패");
        return;
      }

      toast.success("🗑️ 악보가 삭제되었습니다.");

      setShowDeleteModal(false);
      onBack();
      onRefresh();
    } catch (e) {
      console.error(e);
      toast.error("삭제 중 오류가 발생했습니다.");
    }
  };


  const handleShareToggle = async () => {
    if (!detail) return;

    const isShared = detail.share === 1;

    const res = isShared
      ? await unshareSheet(Number(detail.sheetId))
      : await shareSheet(Number(detail.sheetId));

    if (!res.ok) {
      console.error(res.error);
      toast.error("공유 상태 변경 실패");
      return;
    }

    setDetail(prev =>
      prev ? { ...prev, share: res.data.share } : prev
    );

    toast.success(isShared ? "공유가 취소되었습니다." : "악보가 공유되었습니다!");

    onRefresh();
  };

  const handleDifficultyRequest = async (type: "HARDER" | "EASIER") => {
    if (isPreview) {
      toast.error("Preview 상태에서는 난이도 조절이 불가능합니다.");
      return;
    }

    if (!detail?.sheetId) {
      toast.error("sheetId를 찾을 수 없습니다.");
      return;
    }

    try {
      toast.loading("난이도 조절 요청 중...");

      const req = await difficultyFlow.startDifficultyAdjust(
        Number(detail.sheetId),
        type
      );

      toast.dismiss();
      toast.success("난이도 조절 작업이 시작되었습니다!");

      difficultyFlow.pollStatus(req.jobId).then(() => {
        toast.success("난이도 조절이 완료되었습니다!");
        onRefresh();
      });
    } catch (error: any) {
      toast.dismiss();
      toast.error(error.message ?? "난이도 조절 요청 실패");
    }
  };

  return (
    <motion.div
      className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-lg text-gray-100"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <Button onClick={onBack} variant="outline">
            ← Back
          </Button>

          {!isPreview && (
            <div className="flex gap-2 items-center">
              <Button
                onClick={() => setShowEditModal(true)}
                variant="outline"
                className="flex items-center gap-2"
              >
                <FontAwesomeIcon icon={faPenToSquare} />
                Edit
              </Button>

              <Button
                onClick={handleShareToggle}
                variant="outline"
                className={`flex items-center gap-2 ${detail.share === 1
                  ? "text-red-300 border-red-500/40 hover:bg-red-500/10"
                  : "text-blue-300 border-blue-500/40 hover:bg-blue-500/10"
                  }`}
              >
                <FontAwesomeIcon icon={faShare} />
                {detail.share === 1 ? "공유 취소" : "공유하기"}
              </Button>

              <div className="relative">
                <button
                  onClick={() => setOpenMore((prev) => !prev)}
                  className="px-3 py-2 border border-white/20 rounded-lg hover:bg-white/10 transition"
                >
                  ⋯
                </button>

                <AnimatePresence>
                  {openMore && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="absolute right-0 mt-2 w-40 bg-white/20 backdrop-blur-lg 
                     border border-white/10 rounded-xl overflow-hidden shadow-xl"
                    >
                      <button
                        disabled={difficultyFlow.status === "PENDING" || difficultyFlow.status === "PROCESSING"}
                        onClick={() => {
                          handleDifficultyRequest("EASIER");
                          setOpenMore(false);
                        }}
                        className={
                          `block w-full px-4 py-2 text-left ${difficultyFlow.status === "PENDING" || difficultyFlow.status === "PROCESSING"
                            ? "text-gray-500 cursor-not-allowed opacity-50"
                            : "text-green-300 hover:bg-green-500/10"
                          }`}
                      >
                        난이도 ↓
                      </button>

                      <button
                        disabled={difficultyFlow.status === "PENDING" || difficultyFlow.status === "PROCESSING"}
                        onClick={() => {
                          handleDifficultyRequest("HARDER");
                          setOpenMore(false);
                        }}
                        className={
                          `block w-full px-4 py-2 text-left ${difficultyFlow.status === "PENDING" || difficultyFlow.status === "PROCESSING"
                            ? "text-gray-500 cursor-not-allowed opacity-50"
                            : "text-yellow-300 hover:bg-yellow-500/10"
                          }`}
                      >
                        난이도 ↑
                      </button>

                      <button
                        onClick={() => {
                          setShowDeleteModal(true);
                          setOpenMore(false);
                        }}
                        className="block w-full px-4 py-2 text-left text-red-400 hover:bg-red-500/10"
                      >
                        삭제
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

          )}
        </div>
        {!isPreview && (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">
              {detail.title} - {detail.artist}
            </h2>
            <p className="text-gray-300">
              {detail.instrument} · {detail.difficulty}
            </p>
          </div>
        )}
      </div>
      {!isPreview && (
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-300 mb-6">
          {/* <p>
          <span className="font-semibold">Key:</span> {detail.key || "-"}
        </p> */}
          {/* <p>
          <span className="font-semibold">Created:</span>{" "}
          {detail.createdAt.split("T")[0]}
        </p> */}
          <p>
            <span className="font-semibold">Updated:</span>{" "}
            {detail.updatedAt.split("T")[0]}
          </p>
          {/* <p>
          <span className="font-semibold">Audio:</span>{" "}
          {detail.audioUrl ? "Available" : "-"}
        </p> */}
        </div>
      )}

      {detail.sheetDataUrl && (<>
        <h3 className="text-xl font-semibold text-gray-200 mb-4">
          Chord Sheet Preview
        </h3>
        <ChordSheetFromURL url={detail.sheetDataUrl} />
      </>

      )}

      <AnimatePresence>
        {showEditModal && (
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
                className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-8 w-[420px] max-w-[95vw] text-white shadow-xl"
              >
                <h3 className="text-xl font-semibold mb-4 text-center">
                  악보 수정
                </h3>

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
                    onClick={() => setShowEditModal(false)}
                    variant="outline"
                    className="w-[48%]"
                  >
                    취소
                  </Button>
                  <Button
                    onClick={handleSaveEdit}
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

      <AnimatePresence>
        {showDeleteModal && (
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
                className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-8 w-80 text-center text-white shadow-lg"
              >
                <p className="mb-4">
                  정말{" "}
                  <span className="text-red-400 font-semibold">
                    {detail.title}
                  </span>
                  {" "}
                  을(를) 삭제하시겠습니까?
                </p>

                <div className="flex justify-between mt-6">
                  <Button
                    onClick={() => setShowDeleteModal(false)}
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
    </motion.div>
  );
}
