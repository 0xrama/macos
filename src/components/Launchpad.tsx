import { useState, useCallback, useRef } from "react";
import wallpapers from "~/configs/wallpapers";
import apps from "~/configs/apps";
import { startViewTransition, shouldAnimate } from "~/utils/viewTransition";
import { useStore } from "~/stores";

interface LaunchpadProps {
  show: boolean;
  toggleLaunchpad: (target: boolean) => void;
}

const placeholderText = "Search";

export default function Launchpad({ show, toggleLaunchpad }: LaunchpadProps) {
  const dark = useStore((state) => state.dark);

  const [searchText, setSearchText] = useState("");
  const [focus, setFocus] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  const allItems = apps.filter((app) => app.desktop && app.img);

  const filtered = () => {
    if (searchText === "") return allItems;
    const text = searchText.toLowerCase();
    return allItems.filter(
      (item) =>
        item.title.toLowerCase().includes(text) || item.id.toLowerCase().includes(text)
    );
  };

  const handleClose = useCallback(() => {
    if (shouldAnimate() && containerRef.current) {
      containerRef.current.style.setProperty("view-transition-name", "launchpad");
      startViewTransition(() => {
        toggleLaunchpad(false);
      });
      setTimeout(() => {
        containerRef.current?.style.removeProperty("view-transition-name");
      }, 400);
    } else {
      toggleLaunchpad(false);
    }
  }, [toggleLaunchpad]);

  const close = show ? "" : "opacity-0 invisible";

  return (
    <div
      ref={containerRef}
      className={`${close} z-30 transform scale-110 size-full fixed overflow-hidden bg-center bg-cover`}
      id="launchpad"
      style={{
        backgroundImage: `url(${dark ? wallpapers.night : wallpapers.day})`
      }}
      onClick={handleClose}
    >
      <div className="size-full absolute bg-gray-900/20 backdrop-blur-[32px] backdrop-saturate-[180%]">
        {/* Search bar */}
        <div
          className="mx-auto flex h-8 w-64 mt-6 glass-thin rounded-glass"
          onClick={(e) => e.stopPropagation()}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
        >
          <div
            className={`${
              focus ? "w-6 duration-200" : "w-26 delay-250"
            } hstack justify-end`}
          >
            <span className="i-bx:search ml-2 text-white/80" />
          </div>
          <input
            className="flex-1 min-w-0 no-outline bg-transparent px-1 text-sm text-white placeholder:text-white/50"
            placeholder={placeholderText}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>

        {/* App grid */}
        <div
          className="max-w-[1100px] mx-auto mt-8 w-full px-4 sm:px-10"
          grid="~ flow-row cols-4 sm:cols-7"
        >
          {filtered().map((app) => (
            <div
              key={`launchpad-${app.id}`}
              h="32 sm:36"
              flex="~ col"
              className="items-center"
            >
              {"link" in app && app.link ? (
                <a
                  className="w-14 sm:w-20 mx-auto"
                  href={app.link}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => e.stopPropagation()}
                >
                  <img
                    src={app.img}
                    alt={app.title}
                    title={app.title}
                    className="rounded-[22%] shadow-lg"
                  />
                </a>
              ) : (
                <div
                  className="w-14 sm:w-20 mx-auto cursor-default"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClose();
                  }}
                >
                  <img
                    src={app.img}
                    alt={app.title}
                    title={app.title}
                    className="rounded-[22%] shadow-lg hover:scale-110 transition-transform duration-150"
                  />
                </div>
              )}
              <span m="t-2" text="white xs sm:sm center" className="px-1 leading-tight">
                {app.title}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
