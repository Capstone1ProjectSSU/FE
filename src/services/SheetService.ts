import { handleWrappedApi } from "../utils/apiClient";
import type { ApiResult } from "../types/api";
import type {
  SheetListData,
  SheetDetail,
  SheetUpdatePayload,
  SheetUpdateResponse,
} from "../types/sheet";

function authHeader(): Record<string, string> | undefined {
  const token = localStorage.getItem("accessToken");
  return token ? { Authorization: `Bearer ${token}` } : undefined;
}

// GET /api/sheets
export function getSheetList(
  params?: Record<string, any>
): Promise<ApiResult<SheetListData>> {
  const query =
    params && Object.keys(params).length > 0
      ? "?" + new URLSearchParams(params as any).toString()
      : "";

  return handleWrappedApi<SheetListData>(`/api/sheets${query}`, {
    method: "GET",
    headers: {
      ...authHeader(),
    },
  });
}

// GET /api/sheets/{sheet_id}
export function getSheetDetail(id: string): Promise<ApiResult<SheetDetail>> {
  return handleWrappedApi<SheetDetail>(`/api/sheets/${id}`, {
    method: "GET",
    headers: {
      ...authHeader(),
    },
  });
}

// PUT /api/sheets/{sheet_id}
export function updateSheet(
  id: string,
  payload: SheetUpdatePayload
): Promise<ApiResult<SheetUpdateResponse>> {
  return handleWrappedApi<SheetUpdateResponse>(`/api/sheets/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...authHeader(),
    },
    body: JSON.stringify(payload),
  });
}

// DELETE /api/sheets/{sheet_id}
export function deleteSheet(id: string): Promise<ApiResult<null>> {
  return handleWrappedApi<null>(`/api/sheets/${id}`, {
    method: "DELETE",
    headers: {
      ...authHeader(),
    },
  });
}
