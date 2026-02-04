import { AbsoluteFill, useVideoConfig } from "remotion";

const CentralNode: React.FC<{
  x: number;
  y: number;
  size: number;
  primaryColor: string;
  accentColor: string;
  opacity: number;
  glowIntensity: number;
  isCenter?: boolean;
}> = ({
  x,
  y,
  size,
  primaryColor,
  accentColor,
  opacity,
  glowIntensity,
  isCenter = false,
}) => {
  return (
    <g opacity={opacity}>
      {/* Outer glow */}
      <circle
        cx={x}
        cy={y}
        r={size + 20}
        fill="none"
        stroke={primaryColor}
        strokeWidth={1}
        opacity={0.3 * glowIntensity}
        style={{
          filter: `drop-shadow(0 0 ${15 * glowIntensity}px ${primaryColor})`,
        }}
      />

      {/* Middle ring */}
      {!isCenter && (
        <circle
          cx={x}
          cy={y}
          r={size + 10}
          fill="none"
          stroke={accentColor}
          strokeWidth={2}
          opacity={0.6 * glowIntensity}
        />
      )}

      {/* Core circle */}
      <circle
        cx={x}
        cy={y}
        r={size}
        fill={isCenter ? primaryColor : accentColor}
        opacity={0.8 * glowIntensity}
        style={{
          filter: `drop-shadow(0 0 ${20 * glowIntensity}px ${primaryColor})`,
        }}
      />

      {/* Center dot (for outer nodes) */}
      {!isCenter && (
        <circle cx={x} cy={y} r={size * 0.4} fill={primaryColor} opacity={glowIntensity} />
      )}

      {/* Subtle pulse ring (animated in main component) */}
      {isCenter && (
        <circle
          cx={x}
          cy={y}
          r={size + 15}
          fill="none"
          stroke={accentColor}
          strokeWidth={1}
          opacity={0.4 * glowIntensity}
          style={{
            animation: "none",
          }}
        />
      )}
    </g>
  );
};

export const CentralHub: React.FC<{
  opacity: number;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  glowIntensity: number;
}> = ({ opacity, primaryColor, secondaryColor, accentColor, glowIntensity }) => {
  const { width, height } = useVideoConfig();

  const centerX = 960;
  const centerY = 540;
  const nodeRadius = 180;

  // Five nodes positioned in a pentagon
  const nodePositions = [
    { x: centerX, y: centerY - nodeRadius, angle: -Math.PI / 2 }, // Top
    { x: centerX + nodeRadius * Math.cos((Math.PI * 2) / 5 - Math.PI / 2), y: centerY + nodeRadius * Math.sin((Math.PI * 2) / 5 - Math.PI / 2), angle: (Math.PI * 2) / 5 - Math.PI / 2 }, // Top-right
    { x: centerX + nodeRadius * Math.cos((Math.PI * 4) / 5 - Math.PI / 2), y: centerY + nodeRadius * Math.sin((Math.PI * 4) / 5 - Math.PI / 2), angle: (Math.PI * 4) / 5 - Math.PI / 2 }, // Bottom-right
    { x: centerX + nodeRadius * Math.cos((Math.PI * 6) / 5 - Math.PI / 2), y: centerY + nodeRadius * Math.sin((Math.PI * 6) / 5 - Math.PI / 2), angle: (Math.PI * 6) / 5 - Math.PI / 2 }, // Bottom-left
    { x: centerX + nodeRadius * Math.cos((Math.PI * 8) / 5 - Math.PI / 2), y: centerY + nodeRadius * Math.sin((Math.PI * 8) / 5 - Math.PI / 2), angle: (Math.PI * 8) / 5 - Math.PI / 2 }, // Top-left
  ];

  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
        }}
      >
        <defs>
          {/* Gradient for connection lines */}
          <linearGradient id="node-connection-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={primaryColor} />
            <stop offset="50%" stopColor={secondaryColor} />
            <stop offset="100%" stopColor={accentColor} />
          </linearGradient>

          {/* Center glow filter */}
          <filter id="center-glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Chromatic aberration filter */}
          <filter id="chromatic-effect">
            <feColorMatrix
              type="saturate"
              values="1.2"
            />
          </filter>

          {/* Soft glow filter */}
          <filter id="soft-glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Connection lines from center to outer nodes */}
        {nodePositions.map((node, idx) => {
          if (idx === 0) return null; // Skip center node
          return (
            <line
              key={`line-${idx}`}
              x1={centerX}
              y1={centerY}
              x2={node.x}
              y2={node.y}
              stroke="url(#node-connection-gradient)"
              strokeWidth={3}
              opacity={0.8 * opacity * glowIntensity}
              style={{
                filter: `drop-shadow(0 0 8px ${primaryColor})`,
              }}
            />
          );
        })}

        {/* Outer nodes */}
        {nodePositions.map((node, idx) => {
          if (idx === 0) return null; // Skip center node
          return (
            <CentralNode
              key={`node-${idx}`}
              x={node.x}
              y={node.y}
              size={18}
              primaryColor={primaryColor}
              accentColor={accentColor}
              opacity={opacity}
              glowIntensity={glowIntensity}
              isCenter={false}
            />
          );
        })}

        {/* Center node */}
        <CentralNode
          x={centerX}
          y={centerY}
          size={25}
          primaryColor={primaryColor}
          accentColor={accentColor}
          opacity={opacity}
          glowIntensity={glowIntensity}
          isCenter={true}
        />
      </svg>
    </AbsoluteFill>
  );
};
