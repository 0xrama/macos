import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import apps from "~/configs/apps";
import wallpapers from "~/configs/wallpapers";
import { minMarginY } from "~/utils";
import { startViewTransition, shouldAnimate } from "~/utils/viewTransition";
import { gsap } from "gsap";
import { animationPresets, prefersReducedMotion } from "~/utils/animations";
import type { MacActions } from "~/types";
import Notification, {
  NotificationProps,
  NotificationContainer
} from "~/components/Notification";
import LiquidGlassFilter from "~/components/glass/LiquidGlass";
import { useGlassSupport } from "~/hooks/useGlassSupport";

interface DesktopState {
  showApps: {
    [key: string]: boolean;
  };
  appsZ: {
    [key: string]: number;
  };
  maxApps: {
    [key: string]: boolean;
  };
  minApps: {
    [key: string]: boolean;
  };
  maxZ: number;
  showLaunchpad: boolean;
  currentTitle: string;
  hideDockAndTopbar: boolean;
  spotlight: boolean;
  notifications: Array<Omit<NotificationProps, "onClose" | "index">>;
}

export default function Desktop(props: MacActions) {
  const [state, setState] = useState<DesktopState>({
    showApps: {},
    appsZ: {},
    maxApps: {},
    minApps: {},
    maxZ: 2,
    showLaunchpad: false,
    currentTitle: "Finder",
    hideDockAndTopbar: false,
    spotlight: false,
    notifications: []
  });

  const [spotlightBtnRef, setSpotlightBtnRef] =
    useState<React.RefObject<HTMLDivElement> | null>(null);

  const dark = useStore((state) => state.dark);
  const brightness = useStore((state) => state.brightness);

  // Count open, non-minimized windows to throttle the refraction layer.
  const activeWindowCount = useMemo(
    () =>
      Object.keys(state.showApps).filter((id) => state.showApps[id] && !state.minApps[id])
        .length,
    [state.showApps, state.minApps]
  );
  useGlassSupport(activeWindowCount);

  const notificationsShown = useRef(false);

  useEffect(() => {
    // Only show notifications if they haven't been shown yet
    if (notificationsShown.current) return;
    notificationsShown.current = true;

    const notifications: Array<Omit<NotificationProps, "onClose" | "index">> = [
      {
        id: "1",
        title: "Welcome to My Portfolio!",
        message:
          "Feel free to explore the various apps and projects. Click around and have fun!",
        icon: "img/icons/launchpad.png",
        type: "info"
      }
    ];

    notifications.forEach((notification, index) => {
      setTimeout(() => {
        setState((prev) => ({
          ...prev,
          notifications: [...prev.notifications, notification]
        }));
      }, index * 3000);
    });
  }, []);

  const removeNotification = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      notifications: prev.notifications.filter((n) => n.id !== id)
    }));
  }, []);

  const getAppsData = (): void => {
    const showApps: { [key: string]: boolean } = {};
    const appsZ: { [key: string]: number } = {};
    const maxApps: { [key: string]: boolean } = {};
    const minApps: { [key: string]: boolean } = {};

    apps.forEach((app) => {
      showApps[app.id] = !!app.show;
      appsZ[app.id] = 2;
      maxApps[app.id] = false;
      minApps[app.id] = false;
    });

    setState((prev) => ({ ...prev, showApps, appsZ, maxApps, minApps }));
  };

  useEffect(() => {
    getAppsData();
  }, []);

  const toggleLaunchpad = useCallback((target: boolean): void => {
    const r = document.querySelector<HTMLElement>("#launchpad");
    if (!r) return;
    if (target) {
      r.style.transform = "scale(1)";
      r.style.transition = "ease-in 0.2s";
    } else {
      r.style.transform = "scale(1.1)";
      r.style.transition = "ease-out 0.2s";
    }

    setState((prev) => ({ ...prev, showLaunchpad: target }));
  }, []);

  const toggleSpotlight = useCallback((): void => {
    setState((prev) => ({ ...prev, spotlight: !prev.spotlight }));
  }, []);

  const setWindowPosition = (id: string): boolean => {
    const r = document.querySelector<HTMLElement>(`#window-${id}`);
    if (!r) return false;
    const rect = r.getBoundingClientRect();
    r.style.setProperty(
      "--window-transform-x",
      // "+ window.innerWidth" because of the boundary for windows
      (window.innerWidth + rect.x).toFixed(1).toString() + "px"
    );
    r.style.setProperty(
      "--window-transform-y",
      // "- minMarginY" because of the boundary for windows
      (rect.y - minMarginY).toFixed(1).toString() + "px"
    );
    return true;
  };

  const setAppMax = useCallback((id: string, target?: boolean): void => {
    setState((prev) => {
      const newTarget = target === undefined ? !prev.maxApps[id] : target;
      return {
        ...prev,
        maxApps: { ...prev.maxApps, [id]: newTarget },
        hideDockAndTopbar: newTarget
      };
    });
  }, []);

  const setAppMin = useCallback((id: string, target?: boolean): void => {
    setState((prev) => {
      const newTarget = target === undefined ? !prev.minApps[id] : target;
      return {
        ...prev,
        minApps: { ...prev.minApps, [id]: newTarget }
      };
    });
  }, []);

  const minimizeApp = useCallback(
    (id: string): void => {
      if (!setWindowPosition(id)) return;

      // get the corresponding dock icon's position
      const dockEl = document.querySelector<HTMLElement>(`#dock-${id}`);
      const r = document.querySelector<HTMLElement>(`#window-${id}`);
      if (!dockEl || !r) return;

      const dockAppRect = dockEl.getBoundingClientRect();

      const posY = window.innerHeight - r.offsetHeight / 2 - minMarginY;
      // "+ window.innerWidth" because of the boundary for windows
      const posX = window.innerWidth + dockAppRect.x - r.offsetWidth / 2 + 25;

      if (prefersReducedMotion()) {
        // Instant for reduced motion
        r.style.transform = `translate(${posX}px, ${posY}px) scale(0.2)`;
        setAppMin(id, true);
        return;
      }

      // Animate with GSAP for genie effect
      gsap.to(r, {
        x: posX,
        y: posY,
        scale: 0.2,
        opacity: 0.8,
        ...animationPresets.window.minimize,
        onComplete: () => {
          setAppMin(id, true);
          // Reset for next open
          gsap.set(r, { x: 0, y: 0, opacity: 1 });
        }
      });
    },
    [setAppMin]
  );

  const closeApp = useCallback(
    (id: string): void => {
      const winEl = document.querySelector(`#window-${id}`) as HTMLElement;
      if (winEl && shouldAnimate()) {
        winEl.style.setProperty("view-transition-name", `window-${id}`);
        startViewTransition(() => {
          setAppMax(id, false);
          setState((prev) => ({
            ...prev,
            showApps: { ...prev.showApps, [id]: false },
            hideDockAndTopbar: false
          }));
        });
        setTimeout(() => {
          winEl.style.removeProperty("view-transition-name");
        }, 400);
      } else {
        setAppMax(id, false);
        setState((prev) => ({
          ...prev,
          showApps: { ...prev.showApps, [id]: false },
          hideDockAndTopbar: false
        }));
      }
    },
    [setAppMax]
  );

  const openApp = useCallback((id: string): void => {
    const currentApp = apps.find((app) => app.id === id);
    if (currentApp === undefined) {
      throw new TypeError(`App ${id} is undefined.`);
    }

    setState((prev) => {
      const wasMinimized = prev.minApps[id];
      const wasAlreadyOpen = prev.showApps[id];
      const newMaxZ = prev.maxZ + 1;

      if (wasMinimized) {
        setTimeout(() => {
          const r = document.querySelector<HTMLElement>(`#window-${id}`);
          if (!r) return;

          const dockEl = document.querySelector<HTMLElement>(`#dock-${id}`);
          if (!dockEl) return;
          const dockAppRect = dockEl.getBoundingClientRect();

          const startPosY = window.innerHeight - r.offsetHeight / 2 - minMarginY;
          const startPosX = window.innerWidth + dockAppRect.x - r.offsetWidth / 2 + 25;

          const targetX =
            parseFloat(r.style.getPropertyValue("--window-transform-x")) || 0;
          const targetY =
            parseFloat(r.style.getPropertyValue("--window-transform-y")) || 0;

          if (prefersReducedMotion()) {
            r.style.transform = `translate(${targetX}px, ${targetY}px) scale(1)`;
            return;
          }

          gsap.set(r, {
            x: startPosX,
            y: startPosY,
            scale: 0.2,
            opacity: 0.8
          });

          gsap.to(r, {
            x: targetX,
            y: targetY,
            scale: 1,
            opacity: 1,
            ...animationPresets.window.restore
          });
        }, 0);
      } else if (!wasAlreadyOpen && shouldAnimate()) {
        const winEl = document.querySelector(`#window-${id}`) as HTMLElement;
        if (winEl) {
          winEl.style.setProperty("view-transition-name", `window-${id}`);
          setTimeout(() => {
            winEl.style.removeProperty("view-transition-name");
          }, 400);
        }
      }

      return {
        ...prev,
        showApps: { ...prev.showApps, [id]: true },
        appsZ: { ...prev.appsZ, [id]: newMaxZ },
        maxZ: newMaxZ,
        currentTitle: currentApp.title,
        minApps: wasMinimized ? { ...prev.minApps, [id]: false } : prev.minApps
      };
    });
  }, []);

  const renderAppWindows = useMemo(() => {
    return apps
      .filter((app) => app.desktop && state.showApps[app.id])
      .map((app) => {
        const windowProps = {
          id: app.id,
          title: app.title,
          width: app.width,
          height: app.height,
          minWidth: app.minWidth,
          minHeight: app.minHeight,
          aspectRatio: app.aspectRatio,
          x: app.x,
          y: app.y,
          z: state.appsZ[app.id],
          active: state.appsZ[app.id] === state.maxZ,
          max: state.maxApps[app.id],
          min: state.minApps[app.id],
          close: closeApp,
          setMax: setAppMax,
          setMin: minimizeApp,
          focus: openApp
        };

        return (
          <AppWindow key={`desktop-app-${app.id}`} {...windowProps}>
            {app.content}
          </AppWindow>
        );
      });
  }, [
    state.showApps,
    state.appsZ,
    state.maxZ,
    state.maxApps,
    state.minApps,
    closeApp,
    setAppMax,
    minimizeApp,
    openApp
  ]);

  return (
    <div
      className="size-full overflow-hidden bg-center bg-cover"
      style={{
        backgroundImage: `url(${dark ? wallpapers.night : wallpapers.day})`,
        filter: `brightness( ${(brightness as number) * 0.7 + 50}% )`
      }}
    >
      <LiquidGlassFilter />

      <NotificationContainer>
        {state.notifications.map((notification) => (
          <Notification
            key={notification.id}
            {...notification}
            onClose={() => removeNotification(notification.id)}
          />
        ))}
      </NotificationContainer>

      {/* Top Menu Bar */}
      <TopBar
        title={state.currentTitle}
        setLogin={props.setLogin}
        shutMac={props.shutMac}
        sleepMac={props.sleepMac}
        restartMac={props.restartMac}
        toggleSpotlight={toggleSpotlight}
        hide={state.hideDockAndTopbar}
        setSpotlightBtnRef={setSpotlightBtnRef}
      />

      {/* Desktop Apps */}
      <div className="window-bound z-10 absolute" style={{ top: minMarginY }}>
        {renderAppWindows}
      </div>

      {/* Spotlight */}
      {state.spotlight && (
        <Spotlight
          openApp={openApp}
          toggleLaunchpad={toggleLaunchpad}
          toggleSpotlight={toggleSpotlight}
          btnRef={spotlightBtnRef as React.RefObject<HTMLDivElement>}
        />
      )}

      {/* Launchpad */}
      <Launchpad show={state.showLaunchpad} toggleLaunchpad={toggleLaunchpad} />

      {/* Dock */}
      <Dock
        open={openApp}
        showApps={state.showApps}
        showLaunchpad={state.showLaunchpad}
        toggleLaunchpad={toggleLaunchpad}
        hide={state.hideDockAndTopbar}
      />
    </div>
  );
}
