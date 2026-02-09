import { AbsoluteFill, useVideoConfig, interpolate } from "remotion";

export const TextReveal: React.FC<{
  progress: number;
  primaryColor: string;
}> = ({ progress, primaryColor }) => {
  const { width } = useVideoConfig();

  // Professional cubic ease-in-out for premium feel
  const easeProgress =
    progress < 0.5
      ? 2 * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 2) / 2;

  // Opacity with subtle over-extension for dynamic feel
  const opacity = Math.min(1, easeProgress * 1.05);

  // Y offset with ease-out for natural deceleration
  const yOffset = interpolate(easeProgress, [0, 1], [40, 0]);

  // Scale animation - subtle entrance for professionalism
  const scale = interpolate(easeProgress, [0, 1], [0.85, 1]);

  // Letter spacing animation for sophistication
  const letterSpacing = interpolate(easeProgress, [0, 1], [8, 2]);

  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-end",
        paddingBottom: 180,
      }}
    >
      <svg
        width={width}
        height={250}
        viewBox={`0 0 ${width} 250`}
        style={{
          position: "absolute",
          bottom: 180,
        }}
      >
        <defs>
          {/* Premium text gradient - smooth and sophisticated */}
          <linearGradient id="text-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={primaryColor} stopOpacity="0.8" />
            <stop offset="35%" stopColor={primaryColor} stopOpacity="1" />
            <stop offset="65%" stopColor={primaryColor} stopOpacity="1" />
            <stop offset="100%" stopColor={primaryColor} stopOpacity="0.7" />
          </linearGradient>

          {/* Subtle glow filter for premium effect */}
          <filter id="text-glow">
            <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Enhanced text shadow for depth */}
          <filter id="text-shadow">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
            <feOffset in="blur" dx="0" dy="4" result="offset" />
            <feComponentTransfer in="offset" result="offsetblur">
              <feFuncA type="linear" slope="0.3" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode in="offsetblur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* BlockTrace text with professional styling */}
        <text
          x={width / 2}
          y={120}
          textAnchor="middle"
          fontSize="96"
          fontFamily="'Inter', 'Helvetica Neue', '-apple-system', sans-serif"
          fontWeight="700"
          letterSpacing={letterSpacing}
          fill="url(#text-gradient)"
          opacity={opacity}
          style={{
            transform: `translateY(${yOffset}px) scale(${scale})`,
            transformOrigin: "center",
            filter: "url(#text-glow)",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          BlockTrace
        </text>

        {/* Decorative accent line - reveals with text */}
        <g opacity={opacity}>
          {/* Left accent line */}
          <line
            x1={width / 2 - 220}
            y1={155}
            x2={width / 2 - 140}
            y2={155}
            stroke={primaryColor}
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity={easeProgress * 0.6}
            style={{
              filter: `drop-shadow(0 0 8px ${primaryColor})`,
            }}
          />

          {/* Center accent dot */}
          <circle
            cx={width / 2}
            cy={160}
            r={3}
            fill={primaryColor}
            opacity={easeProgress * 0.8}
            style={{
              filter: `drop-shadow(0 0 6px ${primaryColor})`,
            }}
          />

          {/* Right accent line */}
          <line
            x1={width / 2 + 140}
            y1={155}
            x2={width / 2 + 220}
            y2={155}
            stroke={primaryColor}
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity={easeProgress * 0.6}
            style={{
              filter: `drop-shadow(0 0 8px ${primaryColor})`,
            }}
          />
        </g>

        {/* Subtle underline with growth effect */}
        <line
          x1={width / 2 - 180 * easeProgress}
          y1={175}
          x2={width / 2 + 180 * easeProgress}
          y2={175}
          stroke={primaryColor}
          strokeWidth="2"
          opacity={easeProgress * 0.5}
          strokeLinecap="round"
          style={{
            filter: `drop-shadow(0 0 6px ${primaryColor})`,
          }}
        />
      </svg>
    </AbsoluteFill>
  );
};
