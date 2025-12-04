import { handleRawApi } from "../utils/apiClient";
import type { ApiResult } from "../types/api";
import type {
  LoginSuccessResponse,
  SignupResponse,
  AuthMeResponse,
  WithDrawResponse,
} from "../types/auth";

/** SIGNUP */
export function signup(
  username: string,
  password: string,
  email: string
): Promise<ApiResult<SignupResponse>> {
  return handleRawApi<SignupResponse>("/api/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password, email }),
  });
}

/** LOGIN */
export function login(
  username: string,
  password: string
): Promise<ApiResult<LoginSuccessResponse>> {
  return handleRawApi<LoginSuccessResponse>("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
}

/** LOGOUT */
export function logout(): Promise<ApiResult<{ message: string }>> {
  return handleRawApi<{ message: string }>("/api/auth/logout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
}

/** AUTH ME */
export function authMe(): Promise<ApiResult<AuthMeResponse>> {
  const token = localStorage.getItem("accessToken");
  return handleRawApi<AuthMeResponse>("/api/auth/me", {
    method: "GET",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
}

/** WITH DRAW **/
export function withDraw(): Promise<ApiResult<WithDrawResponse>> {
  const token = localStorage.getItem("accessToken");
  return handleRawApi<WithDrawResponse>("/api/auth/withdraw", {
    method: "DELETE",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
}