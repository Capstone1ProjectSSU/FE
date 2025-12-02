import { useState } from "react";
import { motion } from "framer-motion";
import Button from "../../common/Button";
import { useAuth } from "../../../contexts/AuthContext";

import type { CommentItem } from "../../../types/post";
import {
  createComment,
  deleteComment,
  updateComment,
} from "../../../services/CommentService";

interface CommentSectionProps {
  postId: number;
  comments: CommentItem[];
  onCommentAdded?: (c: CommentItem) => void;
  onCommentUpdated?: (c: CommentItem) => void;
  onCommentDeleted?: (commentId: number) => void;
}

const RATING_OPTIONS = [1, 2, 3, 4, 5];

export default function CommentSection({
  postId,
  comments,
  onCommentAdded,
  onCommentUpdated,
  onCommentDeleted,
}: CommentSectionProps) {

  const { user } = useAuth();

  const [localComments, setLocalComments] = useState<CommentItem[]>(comments);

  const [contents, setContents] = useState("");
  const [rating, setRating] = useState<number>(3);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editContents, setEditContents] = useState("");
  const [editRating, setEditRating] = useState<number>(3);


  const handleCreate = async () => {
    if (!contents.trim()) return;

    const result = await createComment(postId, contents.trim(), rating);
    if (!result.ok) {
      console.error(result.error);
      return;
    }

    const { commentId, createdAt } = result.data;

    const newComment: CommentItem = {
      commentId,
      contents: contents.trim(),
      rating,
      createdAt,
      commentName: user,
      myComment: true,
    };

    setLocalComments((prev) => [...prev, newComment]);
    onCommentAdded?.(newComment);

    setContents("");
    setRating(3);
  };

  const startEdit = (c: CommentItem) => {
    setEditingId(c.commentId);
    setEditContents(c.contents);
    setEditRating(c.rating);
  };

  const handleUpdate = async () => {
    if (editingId === null) return;

    const result = await updateComment(editingId, editContents.trim(), editRating);
    if (!result.ok) {
      console.error(result.error);
      return;
    }

    const { commentId, createdAt } = result.data;

    const updated: CommentItem = {
      commentId,
      contents: editContents.trim(),
      rating: editRating,
      createdAt,
      commentName: "You",
      myComment: true,
    };

    setLocalComments((prev) =>
      prev.map((c) => (c.commentId === editingId ? updated : c))
    );

    onCommentUpdated?.(updated);
    setEditingId(null);
  };

  const handleDelete = async (commentId: number) => {
    const res = await deleteComment(commentId);

    if (!res.ok) {
      console.error(res.error);
      return;
    }

    setLocalComments((prev) => prev.filter((c) => c.commentId !== commentId));
    onCommentDeleted?.(commentId);
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="relative bg-white/5 border border-white/10 p-3 rounded-xl">
        <textarea
          className="w-full p-2 bg-white/10 border border-white/10 rounded-lg text-sm text-gray-200 
                   focus:border-blue-400 transition min-h-[80px]"
          placeholder="댓글을 입력하세요..."
          value={contents}
          onChange={(e) => setContents(e.target.value)}
          maxLength={200}
        />

        <div className="flex items-center justify-between mt-2 text-xs">
          <span className="text-gray-400">{contents.length} / 200</span>

          <div className="flex items-center gap-2">
            <select
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="bg-white/10 border border-white/20 text-gray-200 rounded-lg px-2 py-1 text-xs 
                       backdrop-blur-md"
            >
              {RATING_OPTIONS.map((n) => (
                <option key={n} value={n}>
                  ⭐ {n}
                </option>
              ))}
            </select>

            <Button
              variant="primary"
              className="px-3 py-1 text-xs whitespace-nowrap"
              onClick={handleCreate}
            >
              등록
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-col space-y-3">
        {localComments.map((c) =>
          editingId === c.commentId ? (
            <motion.div
              key={c.commentId}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/10 border border-white/10 p-3 rounded-xl"
            >
              <textarea
                className="w-full p-2 bg-white/10 border border-white/20 rounded-lg text-sm"
                value={editContents}
                onChange={(e) => setEditContents(e.target.value)}
                rows={3}
              />

              <div className="flex items-center justify-between mt-2">
                <select
                  value={editRating}
                  onChange={(e) => setEditRating(Number(e.target.value))}
                  className="bg-white/10 border border-white/20 text-gray-200 rounded-lg px-3 py-1 text-xs"
                >
                  {RATING_OPTIONS.map((n) => (
                    <option key={n} value={n}>
                      ⭐ {n}
                    </option>
                  ))}
                </select>

                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setEditingId(null)}>
                    취소
                  </Button>
                  <Button variant="primary" onClick={handleUpdate}>
                    저장
                  </Button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key={c.commentId}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/10 border border-white/10 p-3 rounded-xl"
            >
              <div className="flex justify-between items-center mb-1">
                <span className="text-blue-300 font-semibold text-sm">
                  {c.commentName}
                </span>

                {c.myComment && (
                  <div className="flex gap-3 text-xs">
                    <button
                      className="text-gray-300 hover:text-white"
                      onClick={() => startEdit(c)}
                    >
                      수정
                    </button>
                    <button
                      className="text-red-300 hover:text-red-200"
                      onClick={() => handleDelete(c.commentId)}
                    >
                      삭제
                    </button>
                  </div>
                )}
              </div>

              <p className="text-sm mb-2 leading-snug">{c.contents}</p>

              <div className="flex justify-between items-center text-xs text-gray-400">
                <span>⭐ {c.rating}</span>
                <span>{new Date(c.createdAt).toLocaleString()}</span>
              </div>
            </motion.div>
          )
        )}

        {localComments.length === 0 && (
          <p className="text-center text-gray-500 text-sm py-6">
            아직 댓글이 없습니다. 첫 댓글을 남겨보세요!
          </p>
        )}
      </div>
    </div>
  );

}
