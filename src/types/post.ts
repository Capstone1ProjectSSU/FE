import type { Difficulty } from "./sheet";

// GET /api/post  (목록)
export interface PostListItem {
  postId: number;
  title: string;
  artist: string;
  instrument: string;
  difficulty: Difficulty;
  rating: number;
  commentCount: number;
  share: number;        // 0 | 1
  createdAt: string;
  updatedAt: string;
}

export interface PostListData {
  board: PostListItem[];
}

export interface CommentItem {
  commentId: number;
  commentName: string;
  contents: string;
  rating: number;
  createdAt: string;
  myComment: boolean;
}

// GET /api/post/{postid}
export interface PostDetailData {
  postId: number;
  postUserId: number;
  title: string;
  artist: string;
  instrument: string;
  difficulty: Difficulty;
  rating: number;
  sheetDataUrl: string;
  createdAt: string;
  updatedAt: string;
  commentList: CommentItem[];
  share: number;        // 0 | 1
  myPost: boolean;
}

// POST /api/post/{postid}
/// PATCH /api/post/{postid}
export interface PostShareResponse {
  postId: number;
  share: number; // 0 | 1
}
