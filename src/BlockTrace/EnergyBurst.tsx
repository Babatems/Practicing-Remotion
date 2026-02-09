import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  random,
} from "remotion";
import { useMemo } from "react";

interface Particle {
  id: number;
  angle: number;
  speed: number;
  size: number;
  duration: number;
  startDelay: number;
  colorPhase: number; // 0 = accent, 1 = primary
  rotationSpeed?: number;
}

const generateParticles = (count: number): Particle[] => {
  const particles: Particle[] = [];
  for (let i = 0; i < count; i++) {
    particles.push({
      id: i,
      angle: (Math.PI * 2 * i) / count + (random(i) - 0.5) * 0.8,
      speed: 2.5 + random(i + 100) * 5,
      size: 1.5 + random(i + 200) * 8,
      duration: 35 + random(i + 300) * 25,
      startDelay: random(i + 400) * 8,
      colorPhase: random(i + 500),
      rotationSpeed: -0.15 + random(i + 600) * 0.3,
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
  const easeOutQuad = (t: number) => 1 - (1 - t) * (1 - t);
  const easedProgress = easeOutQuad(progress);
  const distance = particle.speed * particleFrame * (1 + intensity * 0.3);

  const x = 960 + Math.cos(particle.angle) * distance;
  const y = 540 + Math.sin(particle.angle) * distance;

  // Smooth opacity with ease out quad
  const opacity = Math.max(0, (1 - easedProgress) * (1 - easedProgress));
  const size = particle.size * (1 + easedProgress * 0.8);

  // Color transition from accent to primary
  const color = particle.colorPhase < 0.5 ? accentColor : primaryColor;

  return (
    <g key={particle.id}>
      {/* Glow halo */}
      <circle
        cx={x}
        cy={y}
        r={size * 1.5}
        fill={color}
        opacity={opacity * 0.3 * intensity}
        style={{
          filter: `drop-shadow(0 0 ${6 + easedProgress * 8}px ${color})`,
        }}
      />
      {/* Main particle */}
      <circle
        cx={x}
        cy={y}
        r={size}
        fill={color}
        opacity={opacity * intensity}
        style={{
          filter: `drop-shadow(0 0 ${4 + easedProgress * 6}px ${color})`,
        }}
      />
    </g>
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
  const particles = useMemo(() => generateParticles(55), []);

  // Electric pulse rings with staggered timing
  const pulseCount = 5;
  const pulses = useMemo(() => {
    const result = [];
    for (let i = 0; i < pulseCount; i++) {
      result.push({
        id: i,
        delay: i * 3,
        maxRadius: 120 + i * 70,
        thickness: 3 - i * 0.4,
      });
    }
    return result;
  }, []);

  // Chromatic aberration offset (subtle for professional feel)
  const chromaticOffset = intensity * 2;

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
          {/* Radial gradient for center core glow */}
          <radialGradient id="energy-glow" cx="50%" cy="50%" r="50%">
            <stop
              offset="0%"
              stopColor={accentColor}
              stopOpacity={intensity * 0.8}
            />
            <stop
              offset="35%"
              stopColor={primaryColor}
              stopOpacity={intensity * 0.5}
            />
            <stop
              offset="70%"
              stopColor={primaryColor}
              stopOpacity={intensity * 0.2}
            />
            <stop offset="100%" stopColor={primaryColor} stopOpacity={0} />
          </radialGradient>

          {/* Secondary glow for energy waves */}
          <radialGradient id="secondary-glow" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor={primaryColor} stopOpacity={0} />
            <stop
              offset="50%"
              stopColor={primaryColor}
              stopOpacity={intensity * 0.3}
            />
            <stop offset="100%" stopColor={primaryColor} stopOpacity={0} />
          </radialGradient>

          {/* Filter for electric turbulent effect */}
          <filter id="electric-effect">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.85"
              numOctaves="4"
              result="noise"
              seed={Math.floor(frame / 5) % 100}
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale={2.5 * intensity}
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>

          {/* Chromatic aberration filter for professional digital feel */}
          <filter id="chromatic-aberration">
            <feOffset dx={chromaticOffset} dy={0} result="offsetRed" />
            <feOffset
              dx={-chromaticOffset * 0.5}
              dy={chromaticOffset * 0.5}
              result="offsetGreen"
            />
            <feOffset
              dx={-chromaticOffset * 0.5}
              dy={-chromaticOffset * 0.5}
              result="offsetBlue"
            />
            <feComponentTransfer result="separated">
              <feFuncR
                type="discrete"
                tableValues="1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0"
              />
              <feFuncG
                type="discrete"
                tableValues="0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0"
              />
              <feFuncB
                type="discrete"
                tableValues="0 0 0 0 0 0 0 0 1 0 0 0 0 0 0 0"
              />
            </feComponentTransfer>
          </filter>

          {/* Glow blur filter */}
          <filter id="blur-glow">
            <feGaussianBlur stdDeviation={4 * intensity} result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Central core burst - bright and intense */}
        <circle
          cx={960}
          cy={540}
          r={240 * intensity}
          fill="url(#energy-glow)"
          opacity={intensity * 0.9}
          style={{
            filter: "url(#blur-glow)",
          }}
        />

        {/* Secondary pulsing ring for depth */}
        <circle
          cx={960}
          cy={540}
          r={280 * intensity}
          fill="url(#secondary-glow)"
          opacity={intensity * 0.5}
        />

        {/* Electric pulse rings with varying opacity */}
        {pulses.map((pulse) => {
          const ringFrame = Math.max(0, frame - pulse.delay);
          const ringProgress = Math.min(1, ringFrame / 22);
          const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
          const easedProgress = easeOutCubic(ringProgress);
          const radius = pulse.maxRadius * easedProgress;
          const ringOpacity =
            Math.max(0, (1 - ringProgress) * (1 - ringProgress)) *
            intensity *
            0.7;

          return (
            <g key={`pulse-${pulse.id}`}>
              {/* Main ring */}
              <circle
                cx={960}
                cy={540}
                r={radius}
                fill="none"
                stroke={primaryColor}
                strokeWidth={pulse.thickness}
                opacity={ringOpacity}
                style={{
                  filter: "url(#electric-effect)",
                }}
              />

              {/* Glow version of ring */}
              <circle
                cx={960}
                cy={540}
                r={radius}
                fill="none"
                stroke={accentColor}
                strokeWidth={pulse.thickness * 2}
                opacity={ringOpacity * 0.4}
                style={{
                  filter: `drop-shadow(0 0 ${12 * intensity}px ${primaryColor})`,
                }}
              />
            </g>
          );
        })}

        {/* Circuit patterns - enhanced with more detail */}
        {[1, 2, 3, 4].map((idx) => {
          const patternOpacity =
            Math.max(0, 1 - frame * 0.015) * intensity * 0.6;
          const yOffset = 540 + (idx - 2.5) * 75;
          const xOffset = 960 + (idx - 2.5) * 95;

          return (
            <g key={`circuits-${idx}`} opacity={patternOpacity}>
              {/* Horizontal dashed line */}
              <line
                x1={450}
                y1={yOffset}
                x2={1470}
                y2={yOffset}
                stroke={primaryColor}
                strokeWidth={2.5}
                strokeDasharray="25,12"
                style={{
                  filter: `drop-shadow(0 0 6px ${primaryColor})`,
                }}
              />

              {/* Vertical dashed line */}
              <line
                x1={xOffset}
                y1={180}
                x2={xOffset}
                y2={900}
                stroke={primaryColor}
                strokeWidth={2.5}
                strokeDasharray="25,12"
                style={{
                  filter: `drop-shadow(0 0 6px ${primaryColor})`,
                }}
              />

              {/* Diagonal accent line for complexity */}
              <line
                x1={xOffset - 50}
                y1={yOffset - 50}
                x2={xOffset + 50}
                y2={yOffset + 50}
                stroke={accentColor}
                strokeWidth={1.5}
                opacity={patternOpacity * 0.6}
                strokeDasharray="20,10"
                style={{
                  filter: `drop-shadow(0 0 4px ${accentColor})`,
                }}
              />
            </g>
          );
        })}

        {/* Particles burst */}
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
