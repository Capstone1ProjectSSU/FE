interface ProgressBarProps {
  progress: number;
}

export default function ProgressBar({ progress }: ProgressBarProps) {
  const cappedProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <div className="w-full bg-white/10 backdrop-blur-md border border-white/10 rounded-full h-2 overflow-hidden shadow-inner">
      <div
        className={`h-4 transition-all duration-500 ease-out bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 shadow-[0_0_10px_rgba(59,130,246,0.6)] ${
          cappedProgress > 95 ? "animate-pulse" : ""
        }`}
        style={{ width: `${cappedProgress}%` }}
      ></div>
    </div>
  );
}
