import { AbsoluteFill, useVideoConfig, interpolate } from "remotion";

export const TextReveal: React.FC<{
  progress: number;
  primaryColor: string;
}> = ({ progress, primaryColor }) => {
  const { width } = useVideoConfig();

  // Professional cubic ease-in-out for text animation
  const easeProgress = progress < 0.5
    ? 2 * progress * progress
    : 1 - Math.pow(-2 * progress + 2, 2) / 2;

  const opacity = easeProgress;
  const yOffset = interpolate(easeProgress, [0, 1], [30, 0]);
  const scale = interpolate(easeProgress, [0, 1], [0.92, 1]);

  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        bottom: 150,
        width: "100%",
      }}
    >
      <svg
        width={width}
        height={200}
        viewBox={`0 0 ${width} 200`}
        style={{
          position: "absolute",
          bottom: 150,
        }}
      >
        <defs>
          <linearGradient id="text-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={primaryColor} />
            <stop offset="100%" stopColor={primaryColor} stopOpacity="0.6" />
          </linearGradient>

          {/* Text glow filter */}
          <filter id="text-glow">
            <feGaussianBlur stdDeviation="1" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* BlockTrace text */}
        <text
          x={width / 2}
          y={100}
          textAnchor="middle"
          fontSize="72"
          fontFamily="'Inter', 'Helvetica Neue', sans-serif"
          fontWeight="600"
          letterSpacing="2"
          fill="url(#text-gradient)"
          opacity={opacity}
          style={{
            transform: `translateY(${yOffset}px) scale(${scale})`,
            transformOrigin: "center",
            filter: "url(#text-glow)",
          }}
        >
          BlockTrace
        </text>

        {/* Optional: Subtle accent line under text */}
        <line
          x1={width / 2 - 150}
          y1={130}
          x2={width / 2 + 150}
          y2={130}
          stroke={primaryColor}
          strokeWidth="2"
          opacity={opacity * 0.5}
          style={{
            transform: `scaleX(${easeProgress})`,
            transformOrigin: `${width / 2}px 130px`,
          }}
        />
      </svg>
    </AbsoluteFill>
  );
};
