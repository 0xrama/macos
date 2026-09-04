import { flushSync } from "react-dom";

export type TransitionType =
  | "page"
  | "window-open"
  | "window-close"
  | "window-minimize"
  | "window-restore"
  | "launchpad-open"
  | "launchpad-close"
  | "spotlight-open"
  | "spotlight-close"
  | "notification-enter"
  | "notification-exit";

const supportsViewTransitions = (): boolean => {
  if (typeof document === "undefined") return false;
  return typeof document.startViewTransition === "function";
};

const prefersReducedMotion = (): boolean => {
  if (typeof window === "undefined") return true;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

export const supportsViewTransitionAPI = supportsViewTransitions;

export const shouldAnimate = (): boolean => {
  return supportsViewTransitions() && !prefersReducedMotion();
};

export const startViewTransition = (update: () => void, _type?: TransitionType): void => {
  if (!supportsViewTransitions() || prefersReducedMotion()) {
    update();
    return;
  }

  const root = document.documentElement;
  let updateStarted = false;
  root.classList.add("view-transitioning");

  try {
    const transition = document.startViewTransition(() => {
      updateStarted = true;
      flushSync(update);
    });

    void transition.ready.catch(() => undefined);
    void transition.finished
      .catch(() => undefined)
      .finally(() => root.classList.remove("view-transitioning"));
  } catch {
    root.classList.remove("view-transitioning");
    if (!updateStarted) update();
  }
};

export const startViewTransitionAsync = async (update: () => void): Promise<void> => {
  if (!supportsViewTransitions() || prefersReducedMotion()) {
    update();
    return;
  }

  const root = document.documentElement;
  let updateStarted = false;
  root.classList.add("view-transitioning");

  try {
    const transition = document.startViewTransition(() => {
      updateStarted = true;
      flushSync(update);
    });

    await transition.finished;
  } catch {
    if (!updateStarted) update();
  } finally {
    root.classList.remove("view-transitioning");
  }
};

export const withViewTransition = <T extends (...args: any[]) => any>(
  fn: T,
  type?: TransitionType
): T => {
  return ((...args: Parameters<T>) => {
    startViewTransition(() => fn(...args), type);
  }) as T;
};

export const useViewTransition = () => {
  return {
    supports: supportsViewTransitions(),
    animate: shouldAnimate(),
    transition: startViewTransition,
    transitionAsync: startViewTransitionAsync,
    withTransition: withViewTransition
  };
};
