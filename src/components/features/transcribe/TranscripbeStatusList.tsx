import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { useTranscribe } from "../../../contexts/TranscribeContext";
import ProgressBar from "../../common/ProgressBar";
import Button from "../../common/Button";
import { useState } from "react";
import ModalPortal from "../../common/ModalPortal";
import Input from "../../common/Input";
import { useTabs } from "../../../contexts/TabContext";
import toast from "react-hot-toast";

interface TranscribeStatusListProps {
    onPreview?: (item: any) => void;
}

export default function TranscribeStatusList({ onPreview }: TranscribeStatusListProps) {
    const { transcriptions, removeTranscription, resetAll, startTranscription } = useTranscribe();
    const { addTab } = useTabs();

    // 💾 Save modal 상태
    const [showSaveModal, setShowSaveModal] = useState(false);
    const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
    const [songTitle, setSongTitle] = useState("");
    const [artistName, setArtistName] = useState("");

    // ✅ 페이지네이션 상태
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const totalPages = Math.ceil(transcriptions.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    // 최신순 정렬 후 페이지 단위로 자르기
    const paginated = [...transcriptions]
        .sort((a, b) => (a.date < b.date ? 1 : -1))
        .slice(startIndex, endIndex);

    const openSaveModal = (id: string) => {
        setSelectedItemId(id);
        setShowSaveModal(true);
    };

    const handleSave = () => {
        if (!songTitle || !artistName) {
            toast.error("곡 제목과 가수명을 모두 입력해주세요.");
            return;
        }

        const item = transcriptions.find((t) => t.id === selectedItemId);
        if (!item) return;

        addTab({
            title: songTitle,
            artist: artistName,
            instrument: item.instrument === "electric" ? "Electric Guitar" : "Bass Guitar",
            difficulty: item.difficulty,
        });

        toast.success(`🎵 ${songTitle} - ${artistName} 이(가) My Tabs에 저장되었습니다!`);
        setShowSaveModal(false);
        setSongTitle("");
        setArtistName("");
        setSelectedItemId(null);
    };

    if (!transcriptions.length) return null;

    const selectedItem = transcriptions.find((t) => t.id === selectedItemId);

    return (
        <div className="mt-10 space-y-4">
            {/* ✅ 상단 헤더 */}
            <div className="mb-3">
                {/* 제목 */}
                <h3 className="text-sm font-semibold text-gray-400 mb-2">
                    Transcriptions
                </h3>

                {/* 페이지 이동 + Clear All */}
                <div className="flex items-center justify-between">
                    {/* < 1 / 3 > */}
                    <div className="flex items-center space-x-2 text-xs text-gray-400">
                        <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            className={`px-1 py-1 hover:text-white transition ${currentPage === 1 ? "opacity-40 cursor-default" : ""
                                }`}
                        >
                            &lt;
                        </button>
                        <span className="text-gray-300">
                            {currentPage} / {totalPages || 1}
                        </span>
                        <button
                            disabled={currentPage === totalPages || totalPages === 0}
                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                            className={`px-1 py-1 hover:text-white transition ${currentPage === totalPages || totalPages === 0
                                    ? "opacity-40 cursor-default"
                                    : ""
                                }`}
                        >
                            &gt;
                        </button>
                    </div>

                    {/* Clear All 버튼 */}
                    <button
                        onClick={resetAll}
                        className="text-xs text-gray-400 hover:text-red-400 transition"
                    >
                        Clear All
                    </button>
                </div>
            </div>

            {/* ✅ 리스트 (페이지 단위) */}
            <AnimatePresence>
                {paginated.map((item) => (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-xl p-4 text-sm text-gray-100 shadow-md"
                    >
                        <div className="flex justify-between items-center mb-2">
                            <span className="font-medium text-blue-300 truncate max-w-[140px]">
                                {item.fileName}
                            </span>
                            <Button
                                onClick={() => removeTranscription(item.id)}
                                variant="ghost"
                                className="px-[3px] py-[3px] text-xs text-gray-400 hover:text-red-400 transition"
                            >
                                <FontAwesomeIcon icon={faXmark} className="w-3 h-3" />
                            </Button>
                        </div>

                        {item.status === "processing" && (
                            <>
                                <p className="text-gray-400 text-xs mb-1">{item.step}...</p>
                                <ProgressBar progress={item.progress} />
                            </>
                        )}

                        {item.status === "done" && (
                            <>
                                <p className="text-green-400 text-xs font-semibold mb-2">✅ Complete</p>
                                <div className="flex space-x-2">
                                    <Button
                                        variant="primary"
                                        className="text-xs px-3 py-1"
                                        onClick={() => openSaveModal(item.id)}
                                    >
                                        💾 Save
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="text-xs px-3 py-1"
                                        onClick={() => onPreview?.(item)}
                                    >
                                        ▶️ Preview
                                    </Button>
                                </div>
                            </>
                        )}

                        {item.status === "error" && (
                            <>
                                <p className="text-red-400 text-xs font-semibold mb-2">❌ Error</p>
                                <Button
                                    variant="primary"
                                    className="text-xs px-3 py-1"
                                    onClick={() =>
                                        item.file &&
                                        startTranscription(item.file, item.instrument, item.difficulty, item.id)
                                    }
                                >
                                    🔁 Retry
                                </Button>
                            </>
                        )}
                    </motion.div>
                ))}
            </AnimatePresence>

            {/* 💾 Save Modal */}
            <AnimatePresence>
                {showSaveModal && selectedItem && (
                    <ModalPortal>
                        <motion.div
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-8 w-96 text-white shadow-lg"
                            >
                                <h3 className="text-xl font-semibold mb-4 text-center">악보 저장</h3>

                                <div className="bg-white/5 border border-white/10 rounded-lg p-4 mb-5 text-sm text-gray-300">
                                    <p className="mb-1">
                                        <span className="text-gray-400">파일명: </span>
                                        {selectedItem.fileName}
                                    </p>
                                    <p className="mb-1">
                                        <span className="text-gray-400">악기: </span>
                                        {selectedItem.instrument === "electric"
                                            ? "🎸 Electric Guitar"
                                            : "🎵 Bass Guitar"}
                                    </p>
                                    <p>
                                        <span className="text-gray-400">난이도: </span>
                                        {selectedItem.difficulty}
                                    </p>
                                </div>

                                <div className="space-y-4 text-left">
                                    <Input
                                        name="songTitle"
                                        label="곡 이름"
                                        placeholder="예: Wonderwall"
                                        value={songTitle}
                                        onChange={(e) => setSongTitle(e.target.value)}
                                    />
                                    <Input
                                        name="artistName"
                                        label="가수명"
                                        placeholder="예: Oasis"
                                        value={artistName}
                                        onChange={(e) => setArtistName(e.target.value)}
                                    />
                                </div>

                                <div className="flex justify-between mt-6">
                                    <Button
                                        onClick={() => setShowSaveModal(false)}
                                        variant="outline"
                                        className="w-[48%]"
                                    >
                                        취소
                                    </Button>
                                    <Button onClick={handleSave} variant="primary" className="w-[48%]">
                                        저장
                                    </Button>
                                </div>
                            </motion.div>
                        </motion.div>
                    </ModalPortal>
                )}
            </AnimatePresence>
        </div>
    );
}
