import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear } from "@fortawesome/free-solid-svg-icons";
import Button from "../components/common/Button";
// import Input from "../components/common/Input";
import ModalPortal from "../components/common/ModalPortal";
import { extractErrorMessage } from "../utils/error";
import toast from "react-hot-toast";
import { withDraw } from "../services/AuthService";
import { useAuth } from "../contexts/AuthContext";

export default function SettingsPage() {
    const navigate = useNavigate();
    const { logoutUser } = useAuth();
    // const [form, setForm] = useState({ username: "", notifications: true });
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     const { name, type, checked, value } = e.target;
    //     setForm({
    //         ...form,
    //         [name]: type === "checkbox" ? checked : value,
    //     });
    // };

    // const handleSave = () => {
    //     toast.success("[+] Settings saved! (mock)");
    // };

    const handleDeleteAccount = async () => {
        try {
            toast.loading("계정 삭제 중...");

            const res = await withDraw();

            if (!res.ok) {
                toast.dismiss();
                toast.error(extractErrorMessage(res.error) || "회원탈퇴 실패");
                return;
            }

            toast.dismiss();
            toast.success("계정이 삭제되었습니다.");

            logoutUser();
            navigate("/");
        } catch (err: any) {
            toast.dismiss();
            toast.error(err.message ?? "회원탈퇴 중 오류 발생");
        } finally {
            setShowDeleteModal(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-start bg-gradient-to-b from-black via-[#0b0220] to-[#120030] text-white pt-[100px] px-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-3xl bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl shadow-lg p-10 text-center space-y-8"
            >
                <motion.h2
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
                >
                    ⚙️ User Settings
                </motion.h2>

                <p className="text-gray-400 max-w-xl mx-auto">
                    Manage your profile preferences and notifications below.
                </p>

                <div className="w-full max-w-md mx-auto space-y-6 text-left">
                    {/* <Input
                        label="Username"
                        name="username"
                        type="text"
                        value={form.username}
                        onChange={handleChange}
                        placeholder="Enter your username"
                    />

                    <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-md border border-white/10 rounded-xl p-4">
                        <input
                            id="notifications"
                            type="checkbox"
                            name="notifications"
                            checked={form.notifications}
                            onChange={handleChange}
                            className="w-5 h-5 accent-blue-500 cursor-pointer"
                        />
                        <label
                            htmlFor="notifications"
                            className="text-gray-300 cursor-pointer"
                        >
                            Enable notifications
                        </label>
                    </div>

                    <Button onClick={handleSave} variant="primary" className="w-full py-3">
                        Save Settings
                    </Button>

                    <hr className="border-white/10 my-6" /> */}

                    <div className="text-center">
                        <p className="text-gray-400 mb-3 text-sm">
                            Need to delete your account permanently?
                        </p>
                        <Button
                            onClick={() => setShowDeleteModal(true)}
                            variant="outline"
                            className="w-full border-red-500 text-red-400 hover:bg-red-500/10 py-2"
                        >
                            Delete Account
                        </Button>
                    </div>
                </div>
            </motion.div>

            <AnimatePresence>
                {showDeleteModal && (
                    <ModalPortal>
                        <motion.div
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-8 w-96 text-white shadow-lg text-center"
                            >
                                <FontAwesomeIcon
                                    icon={faGear}
                                    className="text-red-400 text-4xl mb-4"
                                />
                                <h3 className="text-xl font-semibold mb-4">Delete Account</h3>
                                <p className="text-gray-300 text-sm mb-6">
                                    Are you sure you want to permanently delete your account?
                                    This action cannot be undone.
                                </p>
                                <div className="flex justify-between mt-4">
                                    <Button
                                        onClick={() => setShowDeleteModal(false)}
                                        variant="outline"
                                        className="w-[48%]"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={handleDeleteAccount}
                                        variant="primary"
                                        className="w-[48%] bg-red-600 hover:bg-red-500"
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </motion.div>
                        </motion.div>
                    </ModalPortal>
                )}
            </AnimatePresence>
        </div>
    );
}
