import { AbsoluteFill, useVideoConfig } from "remotion";

interface LineConfig {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  delay: number;
  index: number;
}

const lineConfigs: LineConfig[] = [
  // Top-left
  {
    startX: 100,
    startY: 100,
    endX: 960,
    endY: 540,
    delay: 0,
    index: 0,
  },
  // Top-right
  {
    startX: 1820,
    startY: 100,
    endX: 960,
    endY: 540,
    delay: 0.08,
    index: 1,
  },
  // Bottom-left
  {
    startX: 100,
    startY: 980,
    endX: 960,
    endY: 540,
    delay: 0.16,
    index: 2,
  },
  // Bottom-right
  {
    startX: 1820,
    startY: 980,
    endX: 960,
    endY: 540,
    delay: 0.24,
    index: 3,
  },
  // Center-top
  {
    startX: 960,
    startY: 50,
    endX: 960,
    endY: 540,
    delay: 0.12,
    index: 4,
  },
];

// Professional easing function for smooth motion graphics
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

const GlowingNode: React.FC<{
  x: number;
  y: number;
  primaryColor: string;
  accentColor: string;
  opacity: number;
  size?: number;
}> = ({ x, y, primaryColor, accentColor, opacity, size = 1 }) => {
  return (
    <g opacity={opacity}>
      {/* Outer glow ring - larger for premium feel */}
      <circle
        cx={x}
        cy={y}
        r={24 * size}
        fill="none"
        stroke={primaryColor}
        strokeWidth={1.5}
        opacity={0.25}
        style={{
          filter: `drop-shadow(0 0 16px ${primaryColor})`,
        }}
      />
      {/* Mid glow */}
      <circle
        cx={x}
        cy={y}
        r={18 * size}
        fill={primaryColor}
        opacity={0.15}
        style={{
          filter: `drop-shadow(0 0 12px ${primaryColor})`,
        }}
      />
      {/* Inner core */}
      <circle
        cx={x}
        cy={y}
        r={10 * size}
        fill={accentColor}
        style={{
          filter: `drop-shadow(0 0 10px ${accentColor})`,
        }}
      />
      {/* Center dot for depth */}
      <circle cx={x} cy={y} r={4 * size} fill={primaryColor} opacity={0.8} />
    </g>
  );
};

const ConnectionLine: React.FC<{
  config: LineConfig;
  progress: number;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
}> = ({ config, progress, primaryColor, secondaryColor, accentColor }) => {
  // Staggered delay for cascading effect
  const delayedProgress =
    Math.max(0, progress - config.delay) / (1 - config.delay);

  // Professional cubic ease-out for smooth, controlled motion
  const lineProgress = Math.min(1, easeOutCubic(delayedProgress));

  // Calculate current positions with precision
  const currentX = config.startX + (config.endX - config.startX) * lineProgress;
  const currentY = config.startY + (config.endY - config.startY) * lineProgress;

  // Node position (trails the line for dynamic effect)
  const nodeTrailDistance = 0.12;
  const nodeProgress = Math.max(0, lineProgress - nodeTrailDistance);
  const nodeX = config.startX + (config.endX - config.startX) * nodeProgress;
  const nodeY = config.startY + (config.endY - config.startY) * nodeProgress;

  // Secondary trailing node for richness
  const secondTrailDistance = 0.06;
  const secondNodeProgress = Math.max(0, lineProgress - secondTrailDistance);
  const secondNodeX =
    config.startX + (config.endX - config.startX) * secondNodeProgress;
  const secondNodeY =
    config.startY + (config.endY - config.startY) * secondNodeProgress;

  const gradientId = `line-gradient-${config.index}`;
  const lineOpacity = Math.min(1, lineProgress * 1.2); // Slightly over-bright for energy

  return (
    <g>
      {/* Define gradients dynamically */}
      {lineProgress > 0 && (
        <defs>
          <linearGradient
            id={gradientId}
            x1={config.startX}
            y1={config.startY}
            x2={currentX}
            y2={currentY}
          >
            <stop offset="0%" stopColor={primaryColor} stopOpacity={0} />
            <stop offset="30%" stopColor={primaryColor} stopOpacity={0.4} />
            <stop offset="70%" stopColor={secondaryColor} stopOpacity={0.8} />
            <stop offset="100%" stopColor={secondaryColor} stopOpacity={1} />
          </linearGradient>
        </defs>
      )}

      {/* Glow/shadow line underneath for depth */}
      {lineProgress > 0.05 && (
        <line
          x1={config.startX}
          y1={config.startY}
          x2={currentX}
          y2={currentY}
          stroke={primaryColor}
          strokeWidth={8}
          strokeLinecap="round"
          opacity={lineOpacity * 0.15}
          style={{
            filter: `blur(4px)`,
          }}
        />
      )}

      {/* Main line with gradient */}
      {lineProgress > 0 && (
        <line
          x1={config.startX}
          y1={config.startY}
          x2={currentX}
          y2={currentY}
          stroke={`url(#${gradientId})`}
          strokeWidth={5}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={lineOpacity}
          style={{
            filter: `drop-shadow(0 0 12px ${primaryColor})`,
          }}
        />
      )}

      {/* Secondary trailing glow line */}
      {secondNodeProgress > 0.05 && (
        <line
          x1={config.startX}
          y1={config.startY}
          x2={secondNodeX}
          y2={secondNodeY}
          stroke={primaryColor}
          strokeWidth={3}
          strokeLinecap="round"
          opacity={Math.max(0, 1 - secondNodeProgress) * 0.4 * lineProgress}
          style={{
            filter: `drop-shadow(0 0 6px ${primaryColor})`,
          }}
        />
      )}

      {/* Leading glowing node */}
      {lineProgress > 0.05 && (
        <GlowingNode
          x={currentX}
          y={currentY}
          primaryColor={primaryColor}
          accentColor={accentColor}
          opacity={lineProgress}
          size={1}
        />
      )}

      {/* Mid-trail node for depth */}
      {secondNodeProgress > 0.05 && secondNodeProgress < 0.95 && (
        <GlowingNode
          x={secondNodeX}
          y={secondNodeY}
          primaryColor={primaryColor}
          accentColor={accentColor}
          opacity={Math.max(0, (1 - secondNodeProgress) * 0.6) * lineProgress}
          size={0.7}
        />
      )}

      {/* Distant trailing node for motion trail */}
      {nodeProgress > 0.1 && nodeProgress < 0.9 && (
        <GlowingNode
          x={nodeX}
          y={nodeY}
          primaryColor={primaryColor}
          accentColor={accentColor}
          opacity={Math.max(0, (1 - nodeProgress) * 0.3) * lineProgress}
          size={0.5}
        />
      )}
    </g>
  );
};

export const ConnectionLines: React.FC<{
  progress: number;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
}> = ({ progress, primaryColor, secondaryColor, accentColor }) => {
  const { width, height } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
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
        {lineConfigs.map((config, idx) => (
          <ConnectionLine
            key={idx}
            config={config}
            progress={progress}
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
            accentColor={accentColor}
          />
        ))}
      </svg>
    </AbsoluteFill>
  );
};
