/**
 * Shared mutable scroll state object.
 * VERCEL SKILL: `rerender-use-ref-transient-values` — use a plain object
 * (not React state) for high-frequency values to avoid re-render storms.
 * R3F useFrame reads this every frame; GSAP writes to it on every scrub tick.
 */
export const scrollState = {
  progress: 0,      // 0..1 — overall scroll progress through the pinned zone
  section: 0,       // 0..5 — current discrete section index
  lampIntensity: 0, // 0..1 — lamp brightness mapped from scroll
};
