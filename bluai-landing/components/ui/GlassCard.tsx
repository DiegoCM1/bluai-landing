import { CSSProperties, ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  /** Optional colored glow strip pinned to the bottom edge. */
  glow?: string;
  className?: string;
  style?: CSSProperties;
}

/**
 * Frosted "liquid glass" panel. Combines the reusable `.glass` surface with
 * an optional colored glow strip (`.glow-strip`) driven by the `--glow` var.
 */
export default function GlassCard({
  children,
  glow,
  className = "",
  style,
}: GlassCardProps) {
  return (
    <div
      className={`glass ${glow ? "glow-strip" : ""} rounded-2xl ${className}`}
      style={{ ...style, ...(glow ? ({ "--glow": glow } as CSSProperties) : {}) }}
    >
      {children}
    </div>
  );
}
