import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, signup, logout as logoutApi, authMe } from "../services/AuthService";
import { extractErrorMessage } from "../utils/error";

interface AuthContextType {
  user: string;
  loading: boolean;

  loginUser: (username: string, password: string) => Promise<void>;
  signupUser: (username: string, password: string, email: string) => Promise<void>;
  logoutUser: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);
export const useAuth = () => useContext(AuthContext)!;

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setLoading(false);
      return;
    }

    refreshUser().finally(() => setLoading(false));
  }, []);

  const loginUser = async (username: string, password: string) => {
    const result = await login(username, password);

    if (!result.ok) {
      throw new Error(extractErrorMessage(result.error));
    }

    const data = result.data;
    localStorage.setItem("accessToken", data.accessToken);

    setUser(data.username);
    navigate("/dashboard");
  };

  const signupUser = async (username: string, password: string, email: string) => {
    const result = await signup(username, password, email);

    if (!result.ok) {
      throw new Error(extractErrorMessage(result.error));
    }
  };

  const logoutUser = async () => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      await logoutApi();
    }

    localStorage.removeItem("accessToken");
    localStorage.removeItem("transcription_jobs");
    setUser("");
    navigate("/");
  };

  const refreshUser = async () => {
    const result = await authMe();

    if (!result.ok) {
      localStorage.removeItem("accessToken");
      setUser("");
      return;
    }

    const msg = result.data.message;
    const username = msg.split(":")[1]?.trim();

    setUser(username);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        loginUser,
        signupUser,
        logoutUser,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
