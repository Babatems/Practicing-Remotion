import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
} from "remotion";
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

  // Phase timing (in frames, assuming 30fps)
  // Phase 1: Assembly (0-3s = 0-90 frames)
  // Phase 2: Convergence & Energy (3-5s = 90-150 frames)
  // Phase 3: Solidification (5-6s = 150-180 frames)
  // Phase 4: Text Reveal (6-7s = 180-210 frames)

  const assemblyEnd = 90;
  const convergenceEnd = 150;
  const solidificationEnd = 180;
  const textRevealEnd = 210;

  // Phase 1: Assembly progress (0 to 1)
  const assemblyProgress = interpolate(frame, [0, assemblyEnd], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Phase 2: Convergence progress (0 to 1)
  const convergenceProgress = interpolate(
    frame,
    [assemblyEnd, convergenceEnd],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  // Phase 3: Solidification progress (0 to 1)
  const solidificationProgress = interpolate(
    frame,
    [convergenceEnd, solidificationEnd],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  // Phase 4: Text reveal progress (0 to 1)
  const textRevealProgress = interpolate(
    frame,
    [solidificationEnd, textRevealEnd],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  // Determine which phase is active
  const isInPhase1 = frame < assemblyEnd;
  const isInPhase2 = frame >= assemblyEnd && frame < convergenceEnd;
  const isInPhase3 = frame >= convergenceEnd && frame < solidificationEnd;
  const isInPhase4 = frame >= solidificationEnd;

  // Logo image animations (starts appearing at end of Phase 2)
  const logoFadeStart = convergenceEnd - 10; // Start fading in logo during last moments of energy burst
  const logoOpacity = interpolate(
    frame,
    [logoFadeStart, solidificationEnd],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  // Professional scale animation: cubic ease-out for entrance
  const logoScaleStart = logoFadeStart;
  const logoScaleProgress = interpolate(
    frame,
    [logoScaleStart, solidificationEnd + 10],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );
  // Cubic ease-out function for professional motion
  const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
  const logoScale = 0.8 + easeOutCubic(logoScaleProgress) * 0.2; // Scale from 0.8 to 1.0

  return (
    <AbsoluteFill
      style={{
        background: "#0A0E27",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      {/* Connection Lines - Phase 1 */}
      {isInPhase1 && (
        <ConnectionLines
          progress={assemblyProgress}
          primaryColor={primaryColor}
          secondaryColor={secondaryColor}
          accentColor={accentColor}
        />
      )}

      {/* Convergence & Energy Burst - Phase 2 */}
      {isInPhase2 && (
        <>
          <ConnectionLines
            progress={1}
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
            accentColor={accentColor}
          />
          <EnergyBurst
            intensity={convergenceProgress}
            primaryColor={primaryColor}
            accentColor={accentColor}
          />
        </>
      )}

      {/* Logo Solidification - Phase 3 & 4 */}
      {(isInPhase3 || isInPhase4) && (
        <CentralHub
          opacity={isInPhase3 ? solidificationProgress : 1}
          primaryColor={primaryColor}
          secondaryColor={secondaryColor}
          accentColor={accentColor}
          glowIntensity={isInPhase3 ? solidificationProgress : 1}
        />
      )}

      {/* BlockTrace Logo Image - appears during Phase 3 & 4 */}
      {frame >= logoFadeStart && (
        <LogoImage
          opacity={logoOpacity}
          scale={logoScale}
        />
      )}

      {/* Text Reveal - Phase 4 */}
      {isInPhase4 && (
        <TextReveal
          progress={textRevealProgress}
          primaryColor={primaryColor}
        />
      )}
    </AbsoluteFill>
  );
};
