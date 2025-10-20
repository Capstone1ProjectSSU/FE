import React, { useState } from "react";
import Button from "../components/common/Button";

const UploadPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!file) return alert("Please select a file first!");
    setIsProcessing(true);

    // 시뮬레이션 (실제 API 연결 시 axios로 전송)
    setTimeout(() => {
      setIsProcessing(false);
      alert(`"${file.name}" uploaded successfully (mock).`);
    }, 2000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-lg text-center">
        <h2 className="text-3xl font-bold text-indigo-600 mb-6">
          Upload Your Audio
        </h2>

        <div className="border-2 border-dashed border-indigo-400 rounded-xl p-6 mb-4">
          <input
            type="file"
            accept=".mp3,.wav"
            onChange={handleFileChange}
            className="w-full text-gray-600"
          />
          {file && (
            <p className="mt-3 text-gray-700">
              Selected file: <strong>{file.name}</strong>
            </p>
          )}
        </div>

        <Button
          onClick={handleUpload}
          disabled={isProcessing}
          className={`px-6 py-2 rounded-lg ${
            isProcessing
              ? "bg-gray-400 text-white"
              : "bg-indigo-600 text-white hover:bg-indigo-700"
          }`}
        >
          {isProcessing ? "Processing..." : "Upload & Transcribe"}
        </Button>
      </div>
    </div>
  );
};

export default UploadPage;
