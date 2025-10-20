import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { TabProvider } from "./contexts/TabContext";
import { TranscribeProvider } from "./contexts/TranscribeContext";
import Navbar from "./components/common/Navbar";
import MainPage from "./pages/MainPage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import SignupPage from "./pages/SignupPage";
import UploadPage from "./pages/UploadPage";
import TabViewPage from "./pages/TabViewPage";
import { Toaster } from "react-hot-toast";

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <TabProvider>
          <TranscribeProvider>
            <Navbar />
          {/* <main> */}
            <Routes>
              <Route path="/" element={<MainPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/upload" element={<UploadPage />} />
              <Route path="/tab/:id" element={<TabViewPage />} />
            </Routes>
          {/* </main> */}
          <Toaster position="top-center" />
          </TranscribeProvider>
        </TabProvider>
      </AuthProvider>
    </Router>
  );
}
