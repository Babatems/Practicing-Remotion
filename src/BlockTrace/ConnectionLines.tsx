import { AbsoluteFill, useVideoConfig } from "remotion";

interface LineConfig {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  delay: number;
}

const lineConfigs: LineConfig[] = [
  // Top-left
  {
    startX: 100,
    startY: 100,
    endX: 960,
    endY: 540,
    delay: 0,
  },
  // Top-right
  {
    startX: 1820,
    startY: 100,
    endX: 960,
    endY: 540,
    delay: 0.1,
  },
  // Bottom-left
  {
    startX: 100,
    startY: 980,
    endX: 960,
    endY: 540,
    delay: 0.2,
  },
  // Bottom-right
  {
    startX: 1820,
    startY: 980,
    endX: 960,
    endY: 540,
    delay: 0.3,
  },
  // Center-top
  {
    startX: 960,
    startY: 50,
    endX: 960,
    endY: 540,
    delay: 0.15,
  },
];

const GlowingNode: React.FC<{
  x: number;
  y: number;
  primaryColor: string;
  accentColor: string;
  opacity: number;
}> = ({ x, y, primaryColor, accentColor, opacity }) => {
  return (
    <g opacity={opacity}>
      {/* Outer glow */}
      <circle
        cx={x}
        cy={y}
        r={20}
        fill={primaryColor}
        opacity={0.3}
        style={{
          filter: `drop-shadow(0 0 15px ${primaryColor})`,
        }}
      />
      {/* Inner core */}
      <circle
        cx={x}
        cy={y}
        r={12}
        fill={accentColor}
        style={{
          filter: `drop-shadow(0 0 8px ${accentColor})`,
        }}
      />
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
  // Delay the start of this line's animation
  const delayedProgress = Math.max(0, progress - config.delay) / (1 - config.delay);
  
  // Apply professional cubic ease-out for smooth motion graphics
  const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
  const lineProgress = Math.min(1, easeOutCubic(delayedProgress));

  // Calculate current positions
  const currentX = config.startX + (config.endX - config.startX) * lineProgress;
  const currentY = config.startY + (config.endY - config.startY) * lineProgress;

  // Node position (trails the line)
  const nodeTrailDistance = 0.15;
  const nodeProgress = Math.max(0, lineProgress - nodeTrailDistance);
  const nodeX = config.startX + (config.endX - config.startX) * nodeProgress;
  const nodeY = config.startY + (config.endY - config.startY) * nodeProgress;

  return (
    <g>
      {/* Connection line with gradient */}
      {lineProgress > 0 && (
        <defs>
          <linearGradient
            id={`line-gradient-${config.delay}`}
            x1={config.startX}
            y1={config.startY}
            x2={currentX}
            y2={currentY}
          >
            <stop offset="0%" stopColor={primaryColor} stopOpacity={0} />
            <stop offset="50%" stopColor={primaryColor} stopOpacity={0.6} />
            <stop offset="100%" stopColor={secondaryColor} stopOpacity={1} />
          </linearGradient>
        </defs>
      )}

      {/* Main line */}
      {lineProgress > 0 && (
        <line
          x1={config.startX}
          y1={config.startY}
          x2={currentX}
          y2={currentY}
          stroke={`url(#line-gradient-${config.delay})`}
          strokeWidth={4}
          strokeLinecap="round"
          opacity={lineProgress}
          style={{
            filter: `drop-shadow(0 0 10px ${primaryColor})`,
          }}
        />
      )}

      {/* Glowing node at the front */}
      {lineProgress > 0 && (
        <GlowingNode
          x={currentX}
          y={currentY}
          primaryColor={primaryColor}
          accentColor={accentColor}
          opacity={lineProgress}
        />
      )}

      {/* Trailing node */}
      {nodeProgress > 0 && nodeProgress < 1 && (
        <GlowingNode
          x={nodeX}
          y={nodeY}
          primaryColor={primaryColor}
          accentColor={accentColor}
          opacity={Math.max(0, 1 - nodeProgress) * 0.5}
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
