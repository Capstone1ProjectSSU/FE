import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf } from "@fortawesome/free-solid-svg-icons";

interface DownloadButtonProps {
  title: string;
  className?: string;
}

export default function DownloadButton({ title, className }: DownloadButtonProps) {
  const handleDownload = () => {
    const blob = new Blob([`Mock PDF for ${title}`], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={handleDownload}
      className={`flex items-center gap-2 px-5 py-2 rounded-lg border border-red-500/50 text-red-400 hover:text-red-300 hover:border-red-400/70 transition font-medium text-sm ${className || ""}`}
    >
      <FontAwesomeIcon icon={faFilePdf} />
      Download
    </button>
  );
}
