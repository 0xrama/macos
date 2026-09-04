import React from "react";
import useRaf from "@rooks/use-raf";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue
} from "framer-motion";

// Hover effect is adopted from https://github.com/PuruVJ/macos-web/blob/main/src/components/dock/DockItem.tsx

const useDockHoverAnimation = (
  mouseX: MotionValue,
  ref: React.RefObject<HTMLImageElement>,
  dockSize: number,
  dockMag: number
) => {
  const distanceLimit = dockSize * 6;
  const distanceInput = useMemo(
    () => [
      -distanceLimit,
      -distanceLimit / (dockMag * 0.65),
      -distanceLimit / (dockMag * 0.85),
      0,
      distanceLimit / (dockMag * 0.85),
      distanceLimit / (dockMag * 0.65),
      distanceLimit
    ],
    [distanceLimit, dockMag]
  );
  const widthOutput = useMemo(
    () => [
      dockSize,
      dockSize * (dockMag * 0.55),
      dockSize * (dockMag * 0.75),
      dockSize * dockMag,
      dockSize * (dockMag * 0.75),
      dockSize * (dockMag * 0.55),
      dockSize
    ],
    [dockSize, dockMag]
  );
  const beyondTheDistanceLimit = distanceLimit + 1;

  // Cache element rect to avoid layout thrashing
  const rectCache = useRef({ left: 0, width: 0 });

  const distance = useMotionValue(beyondTheDistanceLimit);
  const widthPX = useSpring(useTransform(distance, distanceInput, widthOutput), {
    stiffness: 1700,
    damping: 90
  });

  const width = useTransform(widthPX, (w) => `${w / 16}rem`);

  // Update cached rect on mount, resize, and when widthPX changes (icon size changes)
  useEffect(() => {
    const updateRect = () => {
      const el = ref.current;
      if (el) {
        const rect = el.getBoundingClientRect();
        rectCache.current = { left: rect.left, width: rect.width };
      }
    };

    updateRect();
    window.addEventListener("resize", updateRect);

    // Subscribe to widthPX changes to update rect when icon scales
    const unsubscribe = widthPX.on("change", updateRect);

    return () => {
      window.removeEventListener("resize", updateRect);
      unsubscribe();
    };
  }, [ref, widthPX]);

  useRaf(() => {
    const mouseXVal = mouseX.get();
    if (mouseXVal !== null && rectCache.current.width > 0) {
      const imgCenterX = rectCache.current.left + rectCache.current.width / 2;
      // difference between the x coordinate value of the mouse pointer
      // and the img center x coordinate value
      const distanceDelta = mouseXVal - imgCenterX;
      distance.set(distanceDelta);
      return;
    }

    distance.set(beyondTheDistanceLimit);
  }, true);

  return { width, widthPX };
};

interface DockItemProps {
  id: string;
  title: string;
  img: string;
  mouseX: MotionValue;
  desktop: boolean;
  openApp: (id: string) => void;
  isOpen: boolean;
  link?: string;
  dockSize: number;
  dockMag: number;
}

const DockItem = React.memo(function DockItem({
  id,
  title,
  img,
  mouseX,
  desktop,
  openApp,
  isOpen,
  link,
  dockSize,
  dockMag
}: DockItemProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  const { width } = useDockHoverAnimation(mouseX, imgRef, dockSize, dockMag);
  const { winWidth } = useWindowSize();

  const handleClick = useCallback(() => {
    if (desktop || id === "launchpad") {
      openApp(id);
    }
  }, [desktop, id, openApp]);

  return (
    <li
      id={`dock-${id}`}
      onClick={handleClick}
      className="relative flex flex-col justify-end mb-1"
    >
      <p
        className="tooltip absolute inset-x-0 mx-auto w-max rounded-md bg-white/92 dark:bg-gray-800/90 backdrop-blur-[12px] backdrop-saturate-[150%] border-[0.5px] border-black/8 dark:border-white/10"
        p="x-2 y-1"
        text="[13px] c-black"
      >
        {title}
      </p>
      {link ? (
        <a href={link} target="_blank" rel="noreferrer">
          <motion.img
            ref={imgRef}
            src={img}
            alt={title}
            title={title}
            draggable={false}
            style={winWidth < 640 ? {} : { width, willChange: "width" }}
          />
        </a>
      ) : (
        <motion.img
          ref={imgRef}
          src={img}
          alt={title}
          title={title}
          draggable={false}
          style={winWidth < 640 ? {} : { width, willChange: "width" }}
        />
      )}
      <div
        className={`mx-auto rounded-full bg-black/80 dark:bg-white/85 transition-all duration-200 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        style={{ width: "3px", height: "3px" }}
      />
    </li>
  );
});

export default DockItem;
