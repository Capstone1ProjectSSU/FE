import { handleWrappedApi } from "../utils/apiClient";
import type { ApiResult } from "../types/api";
import type {
  PostListData,
  PostDetailData,
  PostShareResponse,
} from "../types/post";

function authHeader(): Record<string, string> | undefined {
  const token = localStorage.getItem("accessToken");
  return token ? { Authorization: `Bearer ${token}` } : undefined;
}

// GET /api/post   (게시글 전체 목록 조회)
export function getPostList(): Promise<ApiResult<PostListData>> {
  return handleWrappedApi<PostListData>("/post", {
    method: "GET",
    headers: { ...authHeader() },
  });
}

// GET /api/post/{postid} (상세 조회)
export function getPostDetail(
  postId: number
): Promise<ApiResult<PostDetailData>> {
  return handleWrappedApi<PostDetailData>(`/post/${postId}`, {
    method: "GET",
    headers: { ...authHeader() },
  });
}

// POST /api/post/{sheet_id(=post_id)} (share)
export function shareSheet(
  postId: number
): Promise<ApiResult<PostShareResponse>> {
  return handleWrappedApi<PostShareResponse>(`/post/${postId}`, {
    method: "POST",
    headers: { ...authHeader() },
  });
}

// PATCH /api/post/{sheet_id(=post_id)} (unshare)
export function unshareSheet(
  postId: number
): Promise<ApiResult<PostShareResponse>> {
  return handleWrappedApi<PostShareResponse>(`/post/${postId}`, {
    method: "PATCH",
    headers: { ...authHeader() },
  });
}
