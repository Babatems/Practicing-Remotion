import { Img, useVideoConfig, staticFile } from "remotion";

export const LogoImage: React.FC<{
  opacity: number;
  scale: number;
}> = ({ opacity, scale }) => {
  const { width, height } = useVideoConfig();

  const centerX = width / 2;
  const centerY = height / 2 - 80; // Positioned slightly higher to leave room for text below

  return (
    <Img
      src={staticFile("/blocktracelogo.jpg")}
      style={{
        position: "absolute",
        left: centerX,
        top: centerY,
        width: 300,
        height: 300,
        transform: `translate(-50%, -50%) scale(${scale})`,
        opacity: opacity,
        filter: `drop-shadow(0 0 40px rgba(0, 217, 255, ${opacity * 0.8}))`,
      }}
    />
  );
};
