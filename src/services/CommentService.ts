import { handleWrappedApi } from "../utils/apiClient";
import type { ApiResult } from "../types/api";
import type { CommentItem } from "../types/post";

function authHeader(): Record<string, string> | undefined {
  const token = localStorage.getItem("accessToken");
  return token ? { Authorization: `Bearer ${token}` } : undefined;
}

/** POST /api/comment/{postId} — 댓글 생성 */
export function createComment(
  postId: number,
  contents: string,
  rating: number
): Promise<ApiResult<CommentItem>> {
  return handleWrappedApi<CommentItem>(`/comment/${postId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeader()
    },
    body: JSON.stringify({ rating, content: contents }),
  });
}

/** PATCH /api/comment/{commentId} — 댓글 수정 */
export function updateComment(
  commentId: number,
  contents: string,
  rating: number
): Promise<ApiResult<CommentItem>> {
  return handleWrappedApi<CommentItem>(`/comment/${commentId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...authHeader()
    },
    body: JSON.stringify({ rating, content: contents }),
  });
}

/** DELETE /api/comment/{commentId} — 댓글 삭제 */
export function deleteComment(
  commentId: number
): Promise<ApiResult<null>> {
  return handleWrappedApi<null>(`/comment/${commentId}`, {
    method: "DELETE",
    headers: { ...authHeader() },
  });
}
