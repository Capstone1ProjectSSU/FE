import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { TabProvider } from "./contexts/TabContext";
import { TranscribeProvider } from "./contexts/TranscribeContext";
import { CommunityProvider } from "./contexts/CommunityContext";
import Navbar from "./components/common/Navbar";
import MainPage from "./pages/MainPage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import SignupPage from "./pages/SignupPage";
import SettingsPage from "./pages/SettingsPage";
import { Toaster } from "react-hot-toast";

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <TabProvider>
          <CommunityProvider>
            <TranscribeProvider>
              <Navbar />
              <Routes>
                <Route path="/" element={<MainPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/settings" element={<SettingsPage />} />
              </Routes>
              <Toaster position="top-center" />
            </TranscribeProvider>
          </CommunityProvider>
        </TabProvider>
      </AuthProvider>
    </Router>
  );
}
