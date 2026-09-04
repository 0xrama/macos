import { useEffect } from "react";

/**
 * useGlassSupport decides whether the heavy Liquid Glass refraction should
 * run, and toggles the `lg-off` class on <html> accordingly. When off,
 * `.lg-refract` surfaces fall back to a plain blur (see glass.css).
 *
 * Refraction is disabled when:
 *  - the user prefers reduced transparency or reduced motion
 *  - the device reports few CPU cores / low memory (proxy for weak GPU)
 *  - many windows are open at once (passed in as `activeWindows`)
 */
export function useGlassSupport(activeWindows = 0) {
  useEffect(() => {
    const root = document.documentElement;

    const reducedTransparency = window.matchMedia(
      "(prefers-reduced-transparency: reduce)"
    ).matches;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const cores = navigator.hardwareConcurrency ?? 8;
    // deviceMemory is Chromium-only; treat missing as capable.
    const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
    const lowPower = cores <= 4 || (memory !== undefined && memory <= 4);

    const tooManyWindows = activeWindows >= 5;

    const disable = reducedTransparency || reducedMotion || lowPower || tooManyWindows;

    root.classList.toggle("lg-off", disable);
  }, [activeWindows]);
}
