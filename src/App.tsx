import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthProvider from "./contexts/AuthContext";
import Navbar from "./components/common/Navbar";
import MainPage from "./pages/MainPage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import SignupPage from "./pages/SignupPage";
import SettingsPage from "./pages/SettingsPage";
import { Toaster } from "react-hot-toast";
import PublicRoute from "./routes/PublicRoute";
import ProtectedRoute from "./routes/ProtectedRoute";
import { TranscriptionHistoryProvider } from "./contexts/TranscriptionHistoryContext";

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <TranscriptionHistoryProvider>
          <Navbar />
          <Routes>
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <LoginPage />
                </PublicRoute>
              }
            />
            <Route
              path="/signup"
              element={
                <PublicRoute>
                  <SignupPage />
                </PublicRoute>
              }
            />
            <Route path="/" element={<MainPage />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <SettingsPage />
                </ProtectedRoute>
              }
            />
          </Routes>
          <Toaster position="top-center" />
        </TranscriptionHistoryProvider>
      </AuthProvider>
    </Router>
  );
}