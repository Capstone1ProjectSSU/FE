import { motion } from "framer-motion";
import Button from "../../common/Button";
import CommentSection from "./CommentSection";
import RatingStars from "./RatingStars";
import { useEffect, useState } from "react";

import { getPostDetail } from "../../../services/PostService";
import type { PostListItem, PostDetailData } from "../../../types/post";
import ChordSheetFromURL from "../../common/ChordSheetFromURL";

interface CommunityDetailPanelProps {
  post: PostListItem;
  onBack: () => void;
  onRefresh: () => void;
}

export default function PostDetailPanel({ post, onBack, onRefresh }: CommunityDetailPanelProps) {
  const [detail, setDetail] = useState<PostDetailData | null>(null);

  useEffect(() => {
    getPostDetail(post.postId).then((result) => {
      if (result.ok) setDetail(result.data);
    });
  }, [post.postId]);

  if (!detail) {
    return (
      <div className="text-gray-300 text-center py-10">
        Loading post details...
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl shadow-lg p-8 text-gray-100"
    >
      <div className="flex flex-col gap-10">
        <div className="flex-1">
          <div className="flex justify-between items-center mb-4">
            <Button onClick={onBack} variant="outline">
              ← Back
            </Button>
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">
              {detail.title} - {detail.artist}
            </h2>
            <p className="text-gray-300">
              {detail.instrument} · {detail.difficulty}
            </p>
          </div>
          <div className="flex flex-col gap-4 text-sm text-gray-300 mb-6">
            <p>
              <span className="font-semibold">Updated:</span>{" "}
              {detail.updatedAt.split("T")[0]}
            </p>
            <div className="flex gap-2 items-center">
              <span className="font-semibold text-gray-200">Rating:</span>
              <RatingStars value={detail.rating} />
              <span className="text-gray-400 text-xs">
                ({detail.rating.toFixed(1)})
              </span>
            </div>
          </div>

          {detail.sheetDataUrl && (
            <div className="mt-10">
              <h3 className="text-xl font-semibold text-gray-200 mb-4">
                Chord Sheet Preview
              </h3>
              <ChordSheetFromURL url={detail.sheetDataUrl} />
            </div>
          )}
        </div>

        <div className="w-full border-t border-white/10 pt-6">
          <h4 className="text-gray-200 font-semibold mb-4 text-lg">Comments</h4>
          <CommentSection
            postId={detail.postId}
            comments={detail.commentList}
            onCommentAdded={onRefresh}
            onCommentUpdated={onRefresh}
            onCommentDeleted={onRefresh}
          />
        </div>
      </div>
    </motion.div>
  );
}
