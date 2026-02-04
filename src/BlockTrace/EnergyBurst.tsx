import { AbsoluteFill, useCurrentFrame, useVideoConfig, random } from "remotion";
import { useMemo } from "react";

interface Particle {
  id: number;
  angle: number;
  speed: number;
  size: number;
  duration: number;
  startDelay: number;
}

const generateParticles = (count: number): Particle[] => {
  const particles: Particle[] = [];
  for (let i = 0; i < count; i++) {
    particles.push({
      id: i,
      angle: (Math.PI * 2 * i) / count + (random(i) - 0.5) * 0.5,
      speed: 3 + random(i + 100) * 4,
      size: 2 + random(i + 200) * 6,
      duration: 30 + random(i + 300) * 20,
      startDelay: random(i + 400) * 10,
    });
  }
  return particles;
};

const Particle: React.FC<{
  particle: Particle;
  frame: number;
  fps: number;
  primaryColor: string;
  accentColor: string;
  intensity: number;
}> = ({ particle, frame, primaryColor, accentColor, intensity }) => {
  const particleFrame = frame - particle.startDelay;
  
  if (particleFrame < 0 || particleFrame > particle.duration) {
    return null;
  }

  const progress = particleFrame / particle.duration;
  const distance = particle.speed * particleFrame * (intensity + 0.5);
  
  const x = 960 + Math.cos(particle.angle) * distance;
  const y = 540 + Math.sin(particle.angle) * distance;
  
  const opacity = Math.max(0, 1 - progress * progress);
  const size = particle.size * (1 + progress * 0.5);

  return (
    <circle
      cx={x}
      cy={y}
      r={size}
      fill={progress < 0.5 ? accentColor : primaryColor}
      opacity={opacity * intensity}
      style={{
        filter: `drop-shadow(0 0 ${4 + progress * 4}px ${primaryColor})`,
      }}
    />
  );
};

export const EnergyBurst: React.FC<{
  intensity: number;
  primaryColor: string;
  accentColor: string;
}> = ({ intensity, primaryColor, accentColor }) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();

  // Generate particles once
  const particles = useMemo(() => generateParticles(40), []);

  // Electric pulse rings
  const pulseCount = 4;
  const pulses = useMemo(() => {
    const result = [];
    for (let i = 0; i < pulseCount; i++) {
      result.push({
        id: i,
        delay: i * 4,
        maxRadius: 150 + i * 60,
      });
    }
    return result;
  }, []);

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
          {/* Radial gradient for center glow */}
          <radialGradient id="energy-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={accentColor} stopOpacity={intensity} />
            <stop offset="50%" stopColor={primaryColor} stopOpacity={intensity * 0.6} />
            <stop offset="100%" stopColor={primaryColor} stopOpacity={0} />
          </radialGradient>

          {/* Filter for electric effect */}
          <filter id="electric-effect">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.8"
              numOctaves="3"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale={3 * intensity}
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>

        {/* Central glow burst */}
        <circle
          cx={960}
          cy={540}
          r={200}
          fill="url(#energy-glow)"
          opacity={intensity}
        />

        {/* Electric pulse rings */}
        {pulses.map((pulse) => {
          const ringFrame = Math.max(0, frame - pulse.delay);
          const ringProgress = Math.min(1, ringFrame / 20);
          const radius = pulse.maxRadius * ringProgress;
          const ringOpacity = Math.max(0, 1 - ringProgress) * intensity;

          return (
            <circle
              key={pulse.id}
              cx={960}
              cy={540}
              r={radius}
              fill="none"
              stroke={primaryColor}
              strokeWidth={2}
              opacity={ringOpacity}
              style={{
                filter: "url(#electric-effect)",
              }}
            />
          );
        })}

        {/* Circuit patterns - horizontal and vertical lines */}
        {[1, 2, 3].map((idx) => {
          const lineOpacity = Math.max(0, 1 - frame * 0.02) * intensity;
          const yOffset = 540 + (idx - 2) * 60;
          const xOffset = 960 + (idx - 2) * 80;

          return (
            <g key={`circuits-${idx}`} opacity={lineOpacity}>
              {/* Horizontal lines */}
              <line
                x1={500}
                y1={yOffset}
                x2={1420}
                y2={yOffset}
                stroke={primaryColor}
                strokeWidth={2}
                strokeDasharray="20,10"
              />
              {/* Vertical lines */}
              <line
                x1={xOffset}
                y1={200}
                x2={xOffset}
                y2={880}
                stroke={primaryColor}
                strokeWidth={2}
                strokeDasharray="20,10"
              />
            </g>
          );
        })}

        {/* Particles */}
        {particles.map((particle) => (
          <Particle
            key={particle.id}
            particle={particle}
            frame={frame}
            fps={fps}
            primaryColor={primaryColor}
            accentColor={accentColor}
            intensity={intensity}
          />
        ))}
      </svg>
    </AbsoluteFill>
  );
};
