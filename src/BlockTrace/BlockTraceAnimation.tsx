import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { z } from "zod";
import { ConnectionLines } from "./ConnectionLines";
import { EnergyBurst } from "./EnergyBurst";
import { CentralHub } from "./CentralHub";
import { TextReveal } from "./TextReveal";
import { LogoImage } from "./LogoImage";

export const blockTraceSchema = z.object({
  primaryColor: z.string().default("#00D9FF"),
  secondaryColor: z.string().default("#0057FF"),
  accentColor: z.string().default("#00FF88"),
});

export const BlockTraceAnimation: React.FC<
  z.infer<typeof blockTraceSchema>
> = ({ primaryColor, secondaryColor, accentColor }) => {
  const frame = useCurrentFrame();

  // Professional phase timing with smooth transitions
  // Phase 1: Assembly (0-3s = 0-90 frames) - Connection lines come in
  // Phase 2: Convergence & Energy (3-5s = 90-150 frames) - Energy burst
  // Phase 3: Solidification (5-6s = 150-180 frames) - Logo appears and settles
  // Phase 4: Text Reveal (6-7s = 180-210 frames) - Text fades in

  const assemblyEnd = 90;
  const convergenceEnd = 150;
  const solidificationEnd = 180;
  const textRevealEnd = 210;

  // Phase progress calculations with proper clamping
  const assemblyProgress = interpolate(frame, [0, assemblyEnd], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const convergenceProgress = interpolate(
    frame,
    [assemblyEnd, convergenceEnd],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  const solidificationProgress = interpolate(
    frame,
    [convergenceEnd, solidificationEnd],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  const textRevealProgress = interpolate(
    frame,
    [solidificationEnd, textRevealEnd],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  // Phase state tracking
  const isInPhase1 = frame < assemblyEnd;
  const isInPhase2 = frame >= assemblyEnd && frame < convergenceEnd;
  const isInPhase3 = frame >= convergenceEnd && frame < solidificationEnd;
  const isInPhase4 = frame >= solidificationEnd;

  // Professional cubic ease-out function for all animations
  const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
  const easedSolidificationProgress = easeOutCubic(solidificationProgress);

  // Logo image animations with staggered entrance
  const logoFadeStart = convergenceEnd - 15; // Start earlier for better flow
  const logoOpacity = interpolate(
    frame,
    [logoFadeStart, solidificationEnd + 5],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  // Scale animation with professional ease-out
  const logoScaleProgress = interpolate(
    frame,
    [logoFadeStart, solidificationEnd + 10],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );
  const logoScale = 0.75 + easeOutCubic(logoScaleProgress) * 0.25; // Scale from 0.75 to 1.0

  // Background with subtle dynamic color shifting
  const bgOpacity = interpolate(frame, [0, 30], [0.8, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: "#0A0E27",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
        opacity: bgOpacity,
      }}
    >
      {/* Background decorative element - subtle grid or dots */}
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          background: `
            radial-gradient(circle at 20% 50%, rgba(0, 217, 255, 0.05) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(0, 255, 136, 0.03) 0%, transparent 50%)
          `,
          pointerEvents: "none",
        }}
      />

      {/* Phase 1: Connection Lines Assembly */}
      {isInPhase1 && (
        <ConnectionLines
          progress={assemblyProgress}
          primaryColor={primaryColor}
          secondaryColor={secondaryColor}
          accentColor={accentColor}
        />
      )}

      {/* Phase 2: Convergence & Energy Burst */}
      {isInPhase2 && (
        <>
          {/* Keep connection lines visible during burst */}
          <ConnectionLines
            progress={1}
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
            accentColor={accentColor}
          />
          {/* Energy burst effect */}
          <EnergyBurst
            intensity={convergenceProgress}
            primaryColor={primaryColor}
            accentColor={accentColor}
          />
        </>
      )}

      {/* Phase 3: Logo Solidification - Central Hub and Logo */}
      {(isInPhase3 || isInPhase4) && (
        <>
          {/* Central Hub Network */}
          <CentralHub
            opacity={isInPhase3 ? easedSolidificationProgress : 1}
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
            accentColor={accentColor}
            glowIntensity={isInPhase3 ? easedSolidificationProgress : 1}
          />

          {/* Logo Image with professional entrance */}
          {frame >= logoFadeStart && (
            <LogoImage opacity={logoOpacity} scale={logoScale} />
          )}
        </>
      )}

      {/* Phase 4: Text Reveal */}
      {isInPhase4 && (
        <TextReveal progress={textRevealProgress} primaryColor={primaryColor} />
      )}
    </AbsoluteFill>
  );
};
