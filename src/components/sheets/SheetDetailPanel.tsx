import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "../common/Button";
import ModalPortal from "../common/ModalPortal";
import Input from "../common/Input";
import toast from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";

import { getSheetDetail } from "../../services/SheetService";
import { useSheets } from "../../contexts/SheetContext";
import type { SheetDetail, SheetBase } from "../../types/sheet";
import type { Instrument } from "../../types/sheet";

interface SheetDetailPanelProps {
  sheet: SheetBase;
  onBack: () => void;
}

export default function SheetDetailPanel({ sheet, onBack }: SheetDetailPanelProps) {
  const { remove, edit } = useSheets();
  const isPreview = (sheet as any).isPreview === true;

  const [detail, setDetail] = useState<SheetDetail | null>(null);
  const [loading, setLoading] = useState(true);

  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  // 수정 필드
  const [editTitle, setEditTitle] = useState(sheet.title);
  const [editArtist, setEditArtist] = useState(sheet.artist);
  const [editDifficulty, setEditDifficulty] = useState(sheet.difficulty);
  const [editInstrument, setEditInstrument] = useState(sheet.instrument);

  useEffect(() => {
    const load = async () => {
      if (isPreview) {
        try {
          const API = "http://localhost:8080";
          const res = await fetch(API + sheet.sheetDataUrl);
          const json = await res.json();

          setDetail({
            musicId: 0,
            title: json.title,
            artist: json.artist,
            instrument: json.instrument,
            difficulty: json.difficulty,
            tempo: json.tempo,
            capo: json.capo,
            createdAt: json.createdAt,
            updatedAt: json.createdAt,
            sheetDataUrl: sheet.sheetDataUrl,
            content: JSON.stringify(json.notes, null, 2)
          });
        } catch (e) {
          console.error("Preview JSON load error:", e);
          toast.error("미리보기 데이터를 불러올 수 없습니다.");
        } finally {
          setLoading(false);
        }
      }
    else {
      try {
        const data = await getSheetDetail(sheet.musicId);
        setDetail(data);
      } catch (e) {
        console.error("Preview error:", e);
        toast.error("미리보기 데이터를 불러올 수 없습니다.");
      } finally {
          setLoading(false);
        }
    } 
    };
    load();
  }, [sheet]);


  if (loading) {
    return (
      <div className="text-center text-gray-300 py-20">
        Loading Sheet Detail...
      </div>
    );
  }

  if (!detail) {
    return (
      <div className="text-center text-gray-300 py-20">
        No Data Available
      </div>
    );
  }

  /** ✏️ 수정 저장 (Preview mode에서는 수정 불가) */
  const handleUpdate = async () => {
    if (!sheet.musicId) {
      toast.error("Preview 상태에서는 수정할 수 없습니다.");
      return;
    }

    await edit({
      musicId: sheet.musicId,
      title: editTitle,
      artist: editArtist,
      difficulty: editDifficulty,
      instrument: editInstrument,
    });

    toast.success("🎉 악보 정보가 수정되었습니다!");
    setShowEdit(false);
  };

  /** 🗑 삭제 (Preview mode에서는 삭제 불가) */
  const handleDelete = async () => {
    if (!sheet.musicId) {
      toast.error("Preview 상태에서는 삭제할 수 없습니다.");
      return;
    }

    await remove(sheet.musicId);
    toast.success("🗑️ 악보가 삭제되었습니다.");
    setShowDelete(false);
    onBack();
  };

  return (
    <motion.div
      className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-lg text-gray-100"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          🎵 {detail.title} - {detail.artist}
        </h2>

        {sheet.musicId && (
          <Button
            onClick={() => setShowEdit(true)}
            variant="outline"
            className="px-4 py-2 flex items-center gap-2 text-sm"
          >
            <FontAwesomeIcon icon={faPenToSquare} />
            Edit
          </Button>
        )}
      </div>

      {/* Info */}
      <div className="space-y-2 text-sm text-gray-300 mb-8">
        <p><span className="font-semibold">Instrument:</span> {detail.instrument}</p>
        <p><span className="font-semibold">Difficulty:</span> {detail.difficulty}</p>
        <p><span className="font-semibold">Tempo:</span> {detail.tempo} BPM</p>
        <p><span className="font-semibold">Capo:</span> {detail.capo}</p>
        <p><span className="font-semibold">Updated:</span> {detail.updatedAt.split("T")[0]}</p>
      </div>

      {/* Content */}
      <div className="bg-black/20 border border-white/10 rounded-lg p-6 font-mono text-blue-300 whitespace-pre-wrap h-80 overflow-auto mb-10">
        {detail.content}
      </div>

      {/* Buttons */}
      <div className="flex justify-between items-center">
        <Button onClick={onBack} variant="outline">
          ← Back
        </Button>

        {sheet.musicId && (
          <Button
            onClick={() => setShowDelete(true)}
            variant="primary"
            className="bg-red-600 hover:bg-red-500 flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faTrash} />
            Delete
          </Button>
        )}
      </div>

      {/* ✏ 수정 모달 */}
      <AnimatePresence>
        {showEdit && (
          <ModalPortal>
            <motion.div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-8 w-96 text-white shadow-lg"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
              >
                <h3 className="text-xl font-semibold mb-4 text-center">악보 수정</h3>

                <div className="space-y-4">
                  <Input
                    label="곡 제목"
                    name="editTitle"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                  />

                  <Input
                    label="아티스트명"
                    name="editArtist"
                    value={editArtist}
                    onChange={(e) => setEditArtist(e.target.value)}
                  />

                  <div>
                    <label className="text-sm text-gray-300 mb-2">악기</label>
                    <select
                      value={editInstrument}
                      onChange={(e) => setEditInstrument(e.target.value as Instrument)}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2"
                    >
                      <option value="GUITAR">Guitar</option>
                      <option value="BASS">Bass</option>
                      <option value="UKULELE">Ukulele</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm text-gray-300 mb-2">난이도</label>
                    <select
                      value={editDifficulty}
                      onChange={(e) => setEditDifficulty(e.target.value as any)}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2"
                    >
                      <option value="EASY">EASY</option>
                      <option value="NORMAL">NORMAL</option>
                      <option value="HARD">HARD</option>
                    </select>
                  </div>
                </div>

                {/* 수정 버튼 */}
                <div className="flex justify-between mt-6">
                  <Button
                    onClick={() => setShowEdit(false)}
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

      {/* 🗑 삭제 모달 */}
      <AnimatePresence>
        {showDelete && (
          <ModalPortal>
            <motion.div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-8 w-80 text-white shadow-lg text-center"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
              >
                <p className="mb-4">
                  정말 <span className="text-red-400 font-bold">{detail.title}</span>을(를) 삭제하시겠습니까?
                </p>

                <div className="flex justify-between mt-6">
                  <Button
                    onClick={() => setShowDelete(false)}
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
