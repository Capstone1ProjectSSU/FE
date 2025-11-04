import { motion } from "framer-motion";
import Button from "../../common/Button";
import CommentSection from "./CommentSection";
import RatingStars from "./RatingStars";
import { useCommunity } from "../../../contexts/CommunityContext";
import type { TabItem } from "../../../types/tab";
import { useEffect, useState } from "react";
import DownloadButton from "../../common/DownloadButton";

interface CommunityDetailPanelProps {
    tab: TabItem;
    onBack: () => void;
}

export default function CommunityDetailPanel({ tab, onBack }: CommunityDetailPanelProps) {
    const { sharedTabs, rateTab } = useCommunity();
    const [currentTab, setCurrentTab] = useState<TabItem>(tab);

    /** ✅ 최신 tab 상태 반영 */
    useEffect(() => {
        const updated = sharedTabs.find((t) => t.id === tab.id);
        if (updated) setCurrentTab(updated);
    }, [sharedTabs, tab.id]);

    const handleRate = (stars: number) => {
        rateTab(currentTab.id, stars);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl shadow-lg p-8 text-gray-100"
        >
            {/* ✅ 좌우 2컬럼 레이아웃 */}
            <div className="flex flex-col lg:flex-row gap-10">
                {/* 🎵 왼쪽: 악보 정보 */}
                <div className="flex-1 min-w-0">
                    <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                        🎵 {currentTab.title} - {currentTab.artist}
                    </h2>

                    {/* 기본 정보 */}
                    <div className="space-y-3 text-sm text-gray-300 mb-8">
                        <p>
                            <span className="font-semibold text-gray-200">Instrument:</span>{" "}
                            {currentTab.instrument}
                        </p>
                        <p>
                            <span className="font-semibold text-gray-200">Difficulty:</span>{" "}
                            {currentTab.difficulty}
                        </p>
                        <p>
                            <span className="font-semibold text-gray-200">Date:</span>{" "}
                            {currentTab.date}
                        </p>
                        {/* 👇 여기에 Rating 정보 추가 */}
                        {typeof currentTab.rating === "number" ? (
                            <div className="flex items-center gap-3">
                                <span className="font-semibold text-gray-200 leading-none flex items-center">
                                    Rating:
                                </span>
                                <div className="flex items-center translate-y-[1px]">
                                    <RatingStars value={currentTab.rating} onRate={handleRate} />
                                </div>
                                <span className="text-gray-400 text-xs translate-y-[1px]">
                                    ({currentTab.rating.toFixed(1)})
                                </span>
                            </div>
                        ) : (
                            <p className="text-sm text-gray-400 italic">No rating yet</p>
                        )}
                    </div>

                    {/* 🎼 악보 프리뷰 */}
                    <div className="border border-white/10 rounded-lg bg-white/5 h-56 flex items-center justify-center text-gray-400 mb-8">
                        TAB preview area 🎼
                    </div>

                    {/* 하단 버튼 영역 */}
                    <div className="flex flex-wrap justify-end gap-3 border-t border-white/10 pt-6">
                        <DownloadButton title={currentTab.title} />
                        <Button
                            onClick={onBack}
                            variant="outline"
                            className="px-5 py-2 flex items-center gap-2 min-w-[100px]"
                        >
                            ← Back
                        </Button>
                    </div>
                </div>

                {/* 💬 오른쪽: 댓글 사이드 */}
                <div className="lg:w-1/3 w-full lg:border-l border-white/10 lg:pl-6 flex flex-col">
                    <h4 className="text-gray-200 font-semibold mb-4 text-lg">Comments</h4>
                    <CommentSection tabId={currentTab.id} comments={currentTab.comments ?? []} />
                </div>
            </div>
        </motion.div>
    );
}
