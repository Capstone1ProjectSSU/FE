import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Button from "../../common/Button";
import ModalPortal from "../../common/ModalPortal";
import Input from "../../common/Input";
import { useTabs } from "../../../contexts/TabContext";
import { useCommunity } from "../../../contexts/CommunityContext";
import toast from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrash, faShareNodes } from "@fortawesome/free-solid-svg-icons";
import DownloadButton from "../../common/DownloadButton";
import RatingStars from "../community/RatingStars";
import type { TabItem } from "../../../types/tab";

interface TabDetailPanelProps {
    tab: TabItem;
    onBack: () => void;
}

export default function TabDetailPanel({ tab, onBack }: TabDetailPanelProps) {
    const { addTab, updateTab, deleteTab } = useTabs();
    const { shareTab } = useCommunity();
    const [showSaveModal, setShowSaveModal] = useState(false);

    // 🧾 수정 & 삭제 모달 상태
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    // 💾 preview 모드 저장용 입력
    const [songTitle, setSongTitle] = useState("");
    const [artistName, setArtistName] = useState("");

    // ✏️ 수정용 입력 상태
    const [editTitle, setEditTitle] = useState(tab.title);
    const [editArtist, setEditArtist] = useState(tab.artist);
    const [editDifficulty, setEditDifficulty] = useState(tab.difficulty);
    const [editInstrument, setEditInstrument] = useState(tab.instrument);

    const handleShare = () => {
        shareTab({
            id: tab.id,
            title: tab.title,
            artist: tab.artist,
            difficulty: tab.difficulty,
            instrument: tab.instrument,
            date: new Date().toLocaleString(),
        });
        toast.success("🎉 커뮤니티에 악보가 공유되었습니다!");
    };

    const handleSave = () => {
        if (!songTitle || !artistName) {
            toast.error("곡 제목과 가수명을 모두 입력해주세요.");
            return;
        }

        addTab({
            title: tab.title,
            artist: tab.artist,
            instrument: tab.instrument,
            difficulty: tab.difficulty,
        });

        toast.success("🎵 TAB이 My Tabs에 저장되었습니다!");
        setSongTitle("");
        setArtistName("");
        onBack();
    };

    // const handleEdit = () => {
    //     updateTab({
    //         ...tab,
    //         title: editTitle,
    //         difficulty: editDifficulty,
    //         instrument: editInstrument,
    //         date: new Date().toLocaleString(),
    //     });

    //     toast.success("✅ 악보 정보가 수정되었습니다!");
    //     setShowEditModal(false);
    // };

    const handleDelete = () => {
        deleteTab(tab.id);
        toast.success("🗑️ 악보가 삭제되었습니다.");
        setShowDeleteModal(false);
        onBack();
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl shadow-lg p-8 text-gray-100"
        >
            <div className="flex justify-between items-start mb-6">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    🎵 {tab.title} - {tab.artist}
                </h2>
                <Button
                    onClick={() => setShowEditModal(true)}
                    variant="outline"
                    className="px-4 py-2 text-sm flex items-center gap-2"
                >
                    <FontAwesomeIcon icon={faPenToSquare} />
                    Edit
                </Button>
            </div>

            {/* 기본 정보 + Rating */}
            <div className="space-y-3 text-sm text-gray-300 mb-8">
                <p>
                    <span className="font-semibold text-gray-200">Instrument:</span>{" "}
                    {tab.instrument}
                </p>
                <p>
                    <span className="font-semibold text-gray-200">Difficulty:</span>{" "}
                    {tab.difficulty}
                </p>
                <p>
                    <span className="font-semibold text-gray-200">Date:</span> {tab.date}
                </p>

                {/* ✅ rating은 공유된 탭(SharedTab)일 때만 표시 */}
                {"rating" in tab && typeof tab.rating === "number" && (
                    <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-200">Rating:</span>
                        <RatingStars value={tab.rating} onRate={() => { }} />
                        <span className="text-gray-400 text-xs">
                            ({tab.rating.toFixed(1)})
                        </span>
                    </div>
                )}
            </div>


            {/* 🎼 악보 프리뷰 */}
            <div className="border border-white/10 rounded-lg bg-white/5 h-56 flex items-center justify-center text-gray-400 mb-8">
                TAB preview area 🎸
            </div>

            {/* Share / Download 그룹 */}
            <div className="flex justify-end gap-3 mb-6">
                <DownloadButton title={tab.title} />
                <Button
                    onClick={handleShare}
                    variant="outline"
                    className="px-5 py-2 flex items-center gap-2 text-blue-400 hover:text-blue-300 border-blue-400/50 hover:border-blue-300/70"
                >
                    <FontAwesomeIcon icon={faShareNodes} />
                    Share
                </Button>
            </div>

            {/* 하단 Back / Delete */}
            <div className="flex justify-between border-t border-white/10 pt-6">
                <Button onClick={onBack} variant="outline">
                    ← Back
                </Button>
                <Button
                    onClick={() => setShowDeleteModal(true)}
                    variant="primary"
                    className="bg-red-600 hover:bg-red-500"
                >
                    <FontAwesomeIcon icon={faTrash} />
                    Delete
                </Button>
            </div>

            {/* 💾 preview 모드일 때 제목 입력 모달 */}
            <AnimatePresence>
                {showSaveModal && (
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
                                        onClick={() => setShowSaveModal(false)} // ✅ 닫기
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

            {/* ✏️ 수정 모달 */}
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
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-8 w-96 text-white shadow-lg"
                            >
                                <h3 className="text-xl font-semibold mb-4 text-center">악보 수정</h3>

                                <div className="space-y-4 text-left">
                                    {/* 🎵 곡 제목 */}
                                    <Input
                                        name="editTitle"
                                        label="곡 제목"
                                        placeholder="예: Wonderwall"
                                        value={editTitle}
                                        onChange={(e) => setEditTitle(e.target.value)}
                                    />

                                    {/* 🎤 아티스트명 */}
                                    <Input
                                        name="editArtist"
                                        label="아티스트명"
                                        placeholder="예: Oasis"
                                        value={editArtist}
                                        onChange={(e) => setEditArtist(e.target.value)}
                                    />


                                    {/* 🎸 악기 선택 */}
                                    <div>
                                        <label className="text-sm font-medium text-gray-300 mb-2">
                                            악기
                                        </label>
                                        <select
                                            value={editInstrument}
                                            onChange={(e) => setEditInstrument(e.target.value)}
                                            className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-gray-200 focus:outline-none"
                                        >
                                            <option value="Electric Guitar">Electric Guitar</option>
                                            <option value="Bass Guitar">Bass Guitar</option>
                                        </select>
                                    </div>

                                    {/* 💪 난이도 선택 */}
                                    <div>
                                        <label className="text-sm font-medium text-gray-300 mb-2">
                                            난이도
                                        </label>
                                        <select
                                            value={editDifficulty}
                                            onChange={(e) =>
                                                setEditDifficulty(
                                                    e.target.value as "Beginner" | "Intermediate" | "Advanced"
                                                )
                                            }
                                            className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-gray-200 focus:outline-none"
                                        >
                                            <option value="Beginner">Beginner</option>
                                            <option value="Intermediate">Intermediate</option>
                                            <option value="Advanced">Advanced</option>
                                        </select>
                                    </div>
                                </div>

                                {/* 버튼 */}
                                <div className="flex justify-between mt-6">
                                    <Button
                                        onClick={() => setShowEditModal(false)}
                                        variant="outline"
                                        className="w-[48%]"
                                    >
                                        취소
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            const updatedTab: TabItem = {
                                                ...tab,
                                                title: editTitle,
                                                artist: editArtist,
                                                difficulty: editDifficulty,
                                                instrument: editInstrument,
                                                date: new Date().toLocaleString(),
                                            };
                                            updateTab(updatedTab);
                                            toast.success("✅ 악보 정보가 수정되었습니다!");
                                            setShowEditModal(false);
                                        }}
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

            {/* 🗑️ 삭제 확인 모달 */}
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
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-8 w-80 text-white shadow-lg text-center"
                            >
                                <p className="mb-4">
                                    정말{" "}
                                    <span className="text-red-400 font-semibold">{tab.title}</span>을(를)
                                    삭제하시겠습니까?
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
