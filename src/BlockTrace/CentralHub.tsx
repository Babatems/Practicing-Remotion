import { AbsoluteFill, useVideoConfig, useCurrentFrame } from "remotion";

const CentralNode: React.FC<{
  x: number;
  y: number;
  size: number;
  primaryColor: string;
  accentColor: string;
  opacity: number;
  glowIntensity: number;
  isCenter?: boolean;
  frame?: number;
}> = ({
  x,
  y,
  size,
  primaryColor,
  accentColor,
  opacity,
  glowIntensity,
  isCenter = false,
  frame = 0,
}) => {
  // Subtle pulsing animation for center node
  const pulsePhase = isCenter
    ? Math.sin((frame * 0.08) % (Math.PI * 2)) * 0.5 + 0.5
    : 0;
  const dynamicGlow = glowIntensity * (1 + pulsePhase * 0.15);

  return (
    <g opacity={opacity}>
      {/* Outermost glow ring - for atmosphere */}
      {isCenter && (
        <circle
          cx={x}
          cy={y}
          r={size + 35}
          fill="none"
          stroke={accentColor}
          strokeWidth={0.8}
          opacity={0.15 * dynamicGlow}
          style={{
            filter: `drop-shadow(0 0 ${12 * dynamicGlow}px ${accentColor})`,
          }}
        />
      )}

      {/* Primary outer glow ring */}
      <circle
        cx={x}
        cy={y}
        r={size + (isCenter ? 28 : 22)}
        fill="none"
        stroke={primaryColor}
        strokeWidth={isCenter ? 1.5 : 1.2}
        opacity={0.4 * dynamicGlow}
        style={{
          filter: `drop-shadow(0 0 ${16 * dynamicGlow}px ${primaryColor})`,
        }}
      />

      {/* Secondary accent ring - for visual complexity */}
      {!isCenter && (
        <circle
          cx={x}
          cy={y}
          r={size + 14}
          fill="none"
          stroke={accentColor}
          strokeWidth={1.8}
          opacity={0.65 * glowIntensity}
          style={{
            filter: `drop-shadow(0 0 8px ${accentColor})`,
          }}
        />
      )}

      {/* Core filled circle */}
      <circle
        cx={x}
        cy={y}
        r={size}
        fill={isCenter ? primaryColor : accentColor}
        opacity={0.9 * glowIntensity}
        style={{
          filter: `drop-shadow(0 0 ${22 * dynamicGlow}px ${primaryColor})`,
        }}
      />

      {/* Inner highlight - for 3D depth */}
      <circle
        cx={x}
        cy={y}
        r={size * 0.5}
        fill={isCenter ? accentColor : primaryColor}
        opacity={isCenter ? 0.3 : 0.5 * glowIntensity}
      />

      {/* Center dot for outer nodes */}
      {!isCenter && (
        <circle
          cx={x}
          cy={y}
          r={size * 0.25}
          fill={primaryColor}
          opacity={0.8 * glowIntensity}
        />
      )}

      {/* Pulsing ring for center node */}
      {isCenter && (
        <circle
          cx={x}
          cy={y}
          r={size + 18 + pulsePhase * 8}
          fill="none"
          stroke={accentColor}
          strokeWidth={1}
          opacity={(0.4 - pulsePhase * 0.3) * glowIntensity}
          style={{
            filter: `drop-shadow(0 0 ${8 * glowIntensity}px ${accentColor})`,
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
}> = ({
  opacity,
  primaryColor,
  secondaryColor,
  accentColor,
  glowIntensity,
}) => {
  const { width, height } = useVideoConfig();
  const frame = useCurrentFrame();

  const centerX = 960;
  const centerY = 540;
  const nodeRadius = 180;

  // Five nodes positioned in a pentagon
  const nodePositions = [
    { x: centerX, y: centerY - nodeRadius, angle: -Math.PI / 2 }, // Top
    {
      x: centerX + nodeRadius * Math.cos((Math.PI * 2) / 5 - Math.PI / 2),
      y: centerY + nodeRadius * Math.sin((Math.PI * 2) / 5 - Math.PI / 2),
      angle: (Math.PI * 2) / 5 - Math.PI / 2,
    }, // Top-right
    {
      x: centerX + nodeRadius * Math.cos((Math.PI * 4) / 5 - Math.PI / 2),
      y: centerY + nodeRadius * Math.sin((Math.PI * 4) / 5 - Math.PI / 2),
      angle: (Math.PI * 4) / 5 - Math.PI / 2,
    }, // Bottom-right
    {
      x: centerX + nodeRadius * Math.cos((Math.PI * 6) / 5 - Math.PI / 2),
      y: centerY + nodeRadius * Math.sin((Math.PI * 6) / 5 - Math.PI / 2),
      angle: (Math.PI * 6) / 5 - Math.PI / 2,
    }, // Bottom-left
    {
      x: centerX + nodeRadius * Math.cos((Math.PI * 8) / 5 - Math.PI / 2),
      y: centerY + nodeRadius * Math.sin((Math.PI * 8) / 5 - Math.PI / 2),
      angle: (Math.PI * 8) / 5 - Math.PI / 2,
    }, // Top-left
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
          {/* Gradient for connection lines - with secondary color accent */}
          <linearGradient
            id="node-connection-gradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor={primaryColor} />
            <stop offset="45%" stopColor={secondaryColor} />
            <stop offset="100%" stopColor={accentColor} />
          </linearGradient>

          {/* Alternative gradient for more dynamic feel */}
          <linearGradient
            id="alt-connection-gradient"
            x1="100%"
            y1="100%"
            x2="0%"
            y2="0%"
          >
            <stop offset="0%" stopColor={accentColor} />
            <stop offset="55%" stopColor={primaryColor} />
            <stop offset="100%" stopColor={secondaryColor} />
          </linearGradient>

          {/* Soft glow filter for nodes */}
          <filter id="node-glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Sharper glow for lines */}
          <filter id="line-glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Connection lines from center to outer nodes */}
        {nodePositions.map((node, idx) => {
          if (idx === 0) return null; // Skip center node line

          // Alternate gradient direction for visual variety
          const gradient =
            idx % 2 === 0
              ? "node-connection-gradient"
              : "alt-connection-gradient";

          // Subtle animation for line width
          const pulsePhase =
            Math.sin((frame * 0.1 + idx) % (Math.PI * 2)) * 0.5 + 0.5;
          const lineWidth = 3 + pulsePhase * 0.8;

          return (
            <g key={`line-${idx}`}>
              {/* Shadow/glow line for depth */}
              <line
                x1={centerX}
                y1={centerY}
                x2={node.x}
                y2={node.y}
                stroke={primaryColor}
                strokeWidth={lineWidth + 4}
                opacity={0.1 * opacity * glowIntensity}
                style={{
                  filter: `blur(3px)`,
                }}
              />

              {/* Main connection line */}
              <line
                x1={centerX}
                y1={centerY}
                x2={node.x}
                y2={node.y}
                stroke={`url(#${gradient})`}
                strokeWidth={lineWidth}
                strokeLinecap="round"
                opacity={0.85 * opacity * glowIntensity}
                style={{
                  filter: `drop-shadow(0 0 10px ${primaryColor})`,
                }}
              />
            </g>
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
              size={20}
              primaryColor={primaryColor}
              accentColor={accentColor}
              opacity={opacity}
              glowIntensity={glowIntensity}
              isCenter={false}
              frame={frame}
            />
          );
        })}

        {/* Center node with dynamic pulsing */}
        <CentralNode
          x={centerX}
          y={centerY}
          size={28}
          primaryColor={primaryColor}
          accentColor={accentColor}
          opacity={opacity}
          glowIntensity={glowIntensity}
          isCenter={true}
          frame={frame}
        />
      </svg>
    </AbsoluteFill>
  );
};
