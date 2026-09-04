import React, { useEffect, useRef } from "react";
import Slider from "react-rangeslider";
import "react-rangeslider/lib/index.css";
import { gsap } from "gsap";
import { animationPresets, prefersReducedMotion } from "~/utils/animations";

interface SliderProps {
  icon: string;
  value: number;
  setValue: (value: number) => void;
}

const SliderComponent = ({ icon, value, setValue }: SliderProps) => (
  <div className="slider flex">
    <div className="size-7 flex-center bg-c-100" border="t l b c-300 rounded-l-full">
      <span className={icon} text="xs c-500" />
    </div>
    <Slider
      min={1}
      max={100}
      value={value}
      tooltip={false}
      orientation="horizontal"
      onChange={(v: number) => setValue(v)}
    />
  </div>
);

interface CCMProps {
  toggleControlCenter: () => void;
  setBrightness: (value: number) => void;
  setVolume: (value: number) => void;
  btnRef: React.RefObject<HTMLDivElement>;
}

export default function ControlCenterMenu({
  toggleControlCenter,
  setBrightness,
  setVolume,
  btnRef
}: CCMProps) {
  const controlCenterRef = useRef<HTMLDivElement>(null);
  const dark = useStore((state) => state.dark);
  const wifi = useStore((state) => state.wifi);
  const brightness = useStore((state) => state.brightness);
  const bluetooth = useStore((state) => state.bluetooth);
  const airdrop = useStore((state) => state.airdrop);
  const fullscreen = useStore((state) => state.fullscreen);
  const volume = useStore((state) => state.volume);
  const toggleWIFI = useStore((state) => state.toggleWIFI);
  const toggleBluetooth = useStore((state) => state.toggleBluetooth);
  const toggleAirdrop = useStore((state) => state.toggleAirdrop);
  const toggleDark = useStore((state) => state.toggleDark);
  const toggleFullScreen = useStore((state) => state.toggleFullScreen);

  useClickOutside(controlCenterRef, toggleControlCenter, [btnRef]);

  // Entrance animation
  useEffect(() => {
    if (prefersReducedMotion() || !controlCenterRef.current) return;

    const ctx = gsap.context(() => {
      // Animate container pop-in
      gsap.fromTo(
        controlCenterRef.current,
        {
          opacity: 0,
          scale: 0.9,
          y: -10
        },
        animationPresets.menu.dropdown
      );

      // Stagger grid items
      const gridItems = controlCenterRef.current.querySelectorAll(".cc-grid");
      gsap.fromTo(
        gridItems,
        {
          opacity: 0,
          scale: 0.8
        },
        {
          opacity: 1,
          scale: 1,
          duration: 0.15,
          stagger: {
            amount: 0.2,
            from: "edges"
          },
          ease: "power2.out",
          delay: 0.05
        }
      );
    }, controlCenterRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      className="w-80 h-80 max-w-full p-2.5 text-c-black glass-thick lg-refract lg-sheen rounded-glass-lg shadow-glass"
      pos="fixed top-9.5 right-0 sm:right-1.5"
      grid="~ cols-4 rows-4 gap-2"
      ref={controlCenterRef}
    >
      <div className="cc-grid row-span-2 col-span-2 p-2 flex flex-col justify-around">
        <div className="hstack space-x-2">
          <div className={`${wifi ? "cc-btn" : "cc-btn-active"}`} onClick={toggleWIFI}>
            <span className="i-material-symbols:wifi text-base" />
          </div>
          <div p="t-0.5">
            <div className="font-medium leading-4">Wi-Fi</div>
            <div className="cc-text">{wifi ? "Home" : "Off"}</div>
          </div>
        </div>
        <div className="hstack space-x-2">
          <div
            className={`${bluetooth ? "cc-btn" : "cc-btn-active"}`}
            onClick={toggleBluetooth}
          >
            <span className="i-charm:bluetooth text-base" />
          </div>
          <div p="t-0.5">
            <div className="font-medium leading-4">Bluetooth</div>
            <div className="cc-text">{bluetooth ? "On" : "Off"}</div>
          </div>
        </div>
        <div className="hstack space-x-2">
          <div
            className={`${airdrop ? "cc-btn" : "cc-btn-active"}`}
            onClick={toggleAirdrop}
          >
            <span className="i-material-symbols:rss-feed-rounded text-base" />
          </div>
          <div p="t-0.5">
            <div className="font-medium leading-4">AirDrop</div>
            <div className="cc-text">{airdrop ? "Contacts Only" : "Off"}</div>
          </div>
        </div>
      </div>
      <div className="cc-grid col-span-2 p-2 hstack space-x-3">
        <div className={`${dark ? "cc-btn" : "cc-btn-active"}`} onClick={toggleDark}>
          {dark ? (
            <span className="i-ion:moon text-base" />
          ) : (
            <span className="i-ion:sunny text-base" />
          )}
        </div>
        <div font-medium>{dark ? "Dark Mode" : "Light Mode"}</div>
      </div>
      <div className="cc-grid flex-center flex-col">
        <span className="i-bi:brightness-alt-high text-xl" />
        <span text="xs center" font="leading-3.5">
          Keyboard Brightness
        </span>
      </div>
      <div
        className="cc-grid flex-center flex-col cursor-default"
        onClick={() => toggleFullScreen(!fullscreen)}
      >
        {fullscreen ? (
          <span className="i-bi:fullscreen-exit text-base" />
        ) : (
          <span className="i-bi:fullscreen text-base" />
        )}
        <span text="xs center" font="leading-3.5" m="t-1.5">
          {fullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
        </span>
      </div>
      <div className="cc-grid col-span-4 px-2.5 py-2 space-y-1 flex flex-col justify-around">
        <span className="font-medium ml-0.5">Display</span>
        <SliderComponent icon="i-ion:sunny" value={brightness} setValue={setBrightness} />
      </div>
      <div className="cc-grid col-span-4 px-2.5 py-2 space-y-1 flex flex-col justify-around">
        <span className="font-medium ml-0.5">Sound</span>
        <SliderComponent icon="i-ion:volume-high" value={volume} setValue={setVolume} />
      </div>
    </div>
  );
}
