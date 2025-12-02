export function extractErrorMessage(error: any): string {
  if (!error) return "알 수 없는 오류가 발생했습니다.";

  if (typeof error === "string") return error;
  if ("message" in error && error.message) return error.message;
  if ("detail" in error && error.detail) return error.detail;
  if ("title" in error && error.title) return error.title;

  return JSON.stringify(error);
}
