import type { ApiResult, ApiResponse, ProblemDetail, ApiErrorBody } from "../types/api";

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * AUTH / 일반 JSON API용 (래퍼 없음)
 * 성공: JSON 전체를 T 로 직접 전달
 */
export async function handleRawApi<T>(
  path: string,
  init?: RequestInit
): Promise<ApiResult<T>> {
  try {
    const res = await fetch(API_BASE_URL + path, init);
    const text = await res.text();
    const json = text ? JSON.parse(text) : null;

    if (res.ok) {
      return { ok: true, data: json as T };
    }

    if (json?.message) {
      return { ok: false, error: { message: json.message } as ApiErrorBody };
    }

    return {
      ok: false,
      error: {
        status: res.status,
        title: res.statusText,
        detail: text,
      } as ProblemDetail,
    };
  } catch (err) {
    return {
      ok: false,
      error: {
        status: 500,
        title: "Network Error",
        detail: String(err),
      },
    };
  }
}

/**
 * Sheet/Post/Comment처럼 래퍼 형태 API 대응
 * { success, code, message, data } 의 data 만 T 로 제공
 */
export async function handleWrappedApi<T>(
  path: string,
  init?: RequestInit
): Promise<ApiResult<T>> {
  try {
    const res = await fetch(API_BASE_URL + path, init);
    const text = await res.text();
    const json: ApiResponse<T> | null = text ? JSON.parse(text) : null;

    if (res.ok && json?.success === true) {
      return { ok: true, data: json.data };
    }

    if (json?.message) {
      return { ok: false, error: { message: json.message } };
    }

    return {
      ok: false,
      error: {
        status: res.status,
        title: res.statusText,
        detail: text,
      } as ProblemDetail,
    };
  } catch (err) {
    return {
      ok: false,
      error: {
        status: 500,
        title: "Network Error",
        detail: String(err),
      },
    };
  }
}
