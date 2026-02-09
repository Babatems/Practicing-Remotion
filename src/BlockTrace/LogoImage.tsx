import { Img, useVideoConfig, staticFile, useCurrentFrame } from "remotion";

export const LogoImage: React.FC<{
  opacity: number;
  scale: number;
}> = ({ opacity, scale }) => {
  const { width, height } = useVideoConfig();
  const frame = useCurrentFrame();

  const centerX = width / 2;
  const centerY = height / 2 - 80; // Positioned slightly higher to leave room for text below

  // Subtle rotation animation for dynamic sophistication
  const rotation = Math.sin((frame * 0.02) % (Math.PI * 2)) * 0.5;

  // Pulsing glow intensity based on frame
  const glowIntensity = Math.sin((frame * 0.05) % (Math.PI * 2)) * 15 + 35;

  return (
    <div
      style={{
        position: "absolute",
        left: centerX,
        top: centerY,
        width: 300,
        height: 300,
        transform: `translate(-50%, -50%) scale(${scale}) rotate(${rotation}deg)`,
        opacity: opacity,
        filter: `
          drop-shadow(0 0 ${glowIntensity}px rgba(0, 217, 255, ${opacity * 0.6}))
          drop-shadow(0 0 ${glowIntensity * 0.6}px rgba(0, 255, 136, ${opacity * 0.4}))
          drop-shadow(0 0 ${glowIntensity * 0.3}px rgba(0, 217, 255, ${opacity * 0.3}))
        `,
        backdropFilter: `brightness(${1 + opacity * 0.1})`,
      }}
    >
      <Img
        src={staticFile("/blocktracelogo.jpg")}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          borderRadius: "8px",
          boxShadow: `
            0 0 20px rgba(0, 217, 255, ${opacity * 0.5}),
            inset 0 0 20px rgba(0, 255, 136, ${opacity * 0.2})
          `,
          mixBlendMode: "screen",
        }}
      />
    </div>
  );
};
