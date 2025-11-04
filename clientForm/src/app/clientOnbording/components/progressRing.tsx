interface ProgressRingProps {
  progress: number;
  size?: number;
  showText?: boolean;
  strokeWidth?: number;
}

export default function ProgressRing({
  progress,
  size = 40,
  showText = false,
  strokeWidth = 4,
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(100, Math.max(0, progress)) / 100) * circumference;
  const progressPercent = Math.round(progress);

  // Determine color based on progress
  const getProgressColor = (p: number) => {
    if (p >= 100) return "#10B981"; // Green
    if (p >= 50) return "#3B82F6";   // Blue
    return "#EF4444";                // Red
  };

  return (
    <div className="relative flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#E5E7EB"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={getProgressColor(progressPercent)}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{
            transition: 'stroke-dashoffset 0.3s ease, stroke 0.3s ease',
          }}
        />
      </svg>
      
      {showText && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-semibold text-gray-700">
            {progressPercent}%
          </span>
        </div>
      )}
    </div>
  );
}