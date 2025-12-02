export interface LoginSuccessResponse {
    accessToken: string;
    tokenType: string;
    username: string;
}

export interface LoginErrorResponse {
    message: string;
}

export interface SignupResponse {
    message: string;
}

export interface SignupErrorResponse {
    message: string;
}

export interface AuthMeResponse {
    message: string;
}

export interface AuthMeErrorResponse {
    message: string;
}

export interface LogoutResponse {
    message: string;
}

export interface WithDrawResponse {
    message: string;
}