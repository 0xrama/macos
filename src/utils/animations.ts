import { gsap } from "gsap";

/**
 * macOS-style easing functions for natural animations
 * These match Apple's Human Interface Guidelines for smooth, natural motion
 */
export const easings = {
  macos: {
    // Subtle spring bounce for window restores - not too bouncy
    spring: "back.out(1.1)",
    // Smooth ease-in-out for transitions - responsive but not jarring
    smooth: "power2.inOut",
    // Gentle pop effect for menus and UI elements
    pop: "back.out(1.3)",
    // Genie effect for minimize (curved, natural feel)
    genie: "power3.inOut",
    // System-like response curve
    system: "power2.out",
    // Deceleration for items appearing
    decel: "power3.out"
  }
};

/**
 * Standard animation durations (in seconds)
 * macOS uses slightly longer, more deliberate timings
 */
export const durations = {
  instant: 0.12,
  fast: 0.2,
  normal: 0.3,
  slow: 0.45
};

/**
 * Pre-configured animation presets for consistency
 */
export const animationPresets = {
  // Spotlight search animations
  spotlight: {
    in: {
      opacity: 1,
      scale: 1,
      y: 0,
      duration: durations.fast,
      ease: "power3.out" as const
    },
    out: {
      opacity: 0,
      scale: 0.98,
      y: -10,
      duration: durations.instant,
      ease: "power2.in" as const
    },
    // Staggered list item appearance
    listItem: {
      opacity: 1,
      x: 0,
      height: "1.75rem", // h-7
      duration: 0.15,
      ease: "power2.out" as const
    }
  },

  // Launchpad animations
  launchpad: {
    iconIn: {
      scale: 1,
      opacity: 1,
      y: 0,
      duration: 0.25,
      ease: "back.out(1.3)" as const
    },
    iconOut: {
      scale: 0.8,
      opacity: 0,
      y: 20,
      duration: 0.12,
      ease: "power2.in" as const
    }
  },

  // Window management animations
  window: {
    minimize: {
      scale: 0.15,
      opacity: 0.6,
      duration: 0.35,
      ease: "power3.inOut" as const
    },
    restore: {
      scale: 1,
      opacity: 1,
      duration: 0.3,
      ease: "back.out(1.1)" as const
    },
    maximize: {
      scale: 1.01,
      duration: 0.2,
      ease: "power2.out" as const
    }
  },

  // Menu dropdown animations
  menu: {
    dropdown: {
      opacity: 1,
      scale: 1,
      y: 0,
      duration: durations.fast,
      ease: "power3.out" as const
    },
    toggle: {
      scale: 0.95,
      duration: 0.08,
      ease: "power2.out" as const
    }
  }
};

/**
 * Check if user prefers reduced motion
 */
export const prefersReducedMotion = (): boolean => {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

/**
 * Check if device is mobile (for simplified animations)
 */
export const isMobile = (): boolean => {
  return window.innerWidth < 640;
};

/**
 * Get stagger amount based on device type
 */
export const getStaggerAmount = (
  mobileAmount: number = 0,
  desktopAmount: number = 0.03
): number => {
  return isMobile() ? mobileAmount : desktopAmount;
};
