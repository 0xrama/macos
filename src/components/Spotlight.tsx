import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { format } from "date-fns";
import apps from "~/configs/apps";
import type { AppsData } from "~/types";
import { startViewTransition, shouldAnimate } from "~/utils/viewTransition";
import { gsap } from "gsap";
import { useStore } from "~/stores";
import { useClickOutside } from "~/hooks";

const getRandom = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const getRandomDate = () => {
  const timeStamp = new Date().getTime();
  const randomStamp = getRandom(0, timeStamp);
  const date = format(randomStamp, "MM/dd/yyyy");
  return date;
};

interface SpotlightProps {
  toggleSpotlight: () => void;
  openApp: (id: string) => void;
  toggleLaunchpad: (target: boolean) => void;
  btnRef: React.RefObject<HTMLDivElement>;
}

export default function Spotlight({
  toggleSpotlight,
  openApp,
  toggleLaunchpad,
  btnRef
}: SpotlightProps) {
  const spotlightRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const itemRefsMap = useRef<Map<string, HTMLLIElement>>(new Map());

  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [clickedID, setClickedID] = useState("");
  const [doubleClicked, setDoubleClicked] = useState<boolean>(false);

  const [searchText, setSearchText] = useState("");

  const textWhite = "text-white";
  const textBlack = "text-c-black";
  const textSelected = "bg-blue-500";

  const searchResults = useMemo(() => {
    if (searchText === "") return [];

    const text = searchText.toLowerCase();
    return apps.filter(
      (item: AppsData) =>
        item.title.toLowerCase().includes(text) || item.id.toLowerCase().includes(text)
    );
  }, [searchText]);

  const appIdList = useMemo(() => {
    return searchResults.map((app) => app.id);
  }, [searchResults]);

  const curDetails = useMemo(() => {
    if (appIdList.length === 0 || searchText === "") return null;

    const appId = appIdList[selectedIndex];
    const appMatch = searchResults.find((item) => item.id === appId);
    return appMatch ? { ...appMatch, type: "app" } : null;
  }, [appIdList, selectedIndex, searchText, searchResults]);

  const setItemRef = useCallback((id: string, el: HTMLLIElement | null) => {
    if (el) {
      itemRefsMap.current.set(id, el);
    } else {
      itemRefsMap.current.delete(id);
    }
  }, []);

  const handleClose = useCallback(() => {
    if (shouldAnimate() && spotlightRef.current) {
      spotlightRef.current.style.setProperty("view-transition-name", "spotlight");
      startViewTransition(() => {
        toggleSpotlight();
      });
      setTimeout(() => {
        spotlightRef.current?.style.removeProperty("view-transition-name");
      }, 300);
    } else {
      toggleSpotlight();
    }
  }, [toggleSpotlight]);

  useClickOutside(spotlightRef, handleClose, [btnRef]);

  useEffect(() => {
    if (appIdList.length === 0 || !clickedID) return;
    const newSelectedIndex = appIdList.findIndex((item) => item === clickedID);
    if (newSelectedIndex >= 0) {
      updateHighlight(selectedIndex, newSelectedIndex);
      setSelectedIndex(newSelectedIndex);
    }
  }, [clickedID]);

  useEffect(() => {
    if (doubleClicked) {
      launchSelectedApp();
      setDoubleClicked(false);
    }
  }, [doubleClicked]);

  const handleClick = useCallback((id: string) => {
    setClickedID(id);
  }, []);

  const handleDoubleClick = useCallback((id: string) => {
    setClickedID(id);
    setDoubleClicked(true);
  }, []);

  const launchSelectedApp = useCallback(() => {
    if (!curDetails) return;
    if (curDetails.type === "app" && !curDetails.link) {
      const id = curDetails.id;
      if (id === "launchpad") toggleLaunchpad(true);
      else openApp(id);
      handleClose();
    } else {
      window.open(curDetails.link);
      handleClose();
    }
  }, [curDetails, toggleLaunchpad, openApp, handleClose]);

  const updateHighlight = useCallback(
    (prevIndex: number, curIndex: number) => {
      if (appIdList.length === 0) return;

      const prevAppId = appIdList[prevIndex];
      const curAppId = appIdList[curIndex];
      const prev = itemRefsMap.current.get(prevAppId);
      const cur = itemRefsMap.current.get(curAppId);

      if (prev && prev !== cur) {
        gsap.to(prev, {
          backgroundColor: "transparent",
          color: "#1a1a1a",
          duration: 0.15
        });
      }

      if (cur) {
        gsap.to(cur, {
          backgroundColor: "#3b82f6",
          color: "#ffffff",
          duration: 0.15
        });
      }
    },
    [appIdList]
  );

  const renderAppItem = useCallback(
    (app: AppsData, index: number) => {
      const isSelected = index === selectedIndex;
      const bg = isSelected ? textSelected : "bg-transparent";
      const text = isSelected ? textWhite : textBlack;

      return (
        <li
          key={`spotlight-${app.id}`}
          ref={(el) => setItemRef(app.id, el)}
          className={`pr-1 h-8 items-center w-full flex rounded-lg ${bg} ${text} cursor-default`}
          onClick={() => handleClick(app.id)}
          onDoubleClick={() => handleDoubleClick(app.id)}
        >
          <div className="w-8 flex-center">
            <img className="w-5" src={app.img} alt={app.title} title={app.title} />
          </div>
          <div className="flex-1 hstack overflow-hidden whitespace-nowrap">
            {app.title}
          </div>
        </li>
      );
    },
    [selectedIndex, handleClick, handleDoubleClick, setItemRef]
  );

  const appListJSX = useMemo(() => {
    if (searchText === "") return null;

    return (
      <div>
        {searchResults.length !== 0 && (
          <div>
            <div className="spotlight-type">Applications</div>
            <ul className="w-full text-xs">{searchResults.map(renderAppItem)}</ul>
          </div>
        )}
      </div>
    );
  }, [searchText, searchResults, renderAppItem]);

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const keyCode = e.key;
      const numApps = appIdList.length;

      if (keyCode === "ArrowDown" && selectedIndex < numApps - 1) {
        updateHighlight(selectedIndex, selectedIndex + 1);
        setSelectedIndex(selectedIndex + 1);
      } else if (keyCode === "ArrowUp" && selectedIndex > 0) {
        updateHighlight(selectedIndex, selectedIndex - 1);
        setSelectedIndex(selectedIndex - 1);
      } else if (keyCode === "Enter") {
        if (!curDetails) return;
        launchSelectedApp();
      }
    },
    [appIdList.length, selectedIndex, curDetails, updateHighlight, launchSelectedApp]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      updateHighlight(selectedIndex, 0);
      setSelectedIndex(0);
      setSearchText(e.target.value);
    },
    [updateHighlight, selectedIndex]
  );

  return (
    <div
      className="spotlight"
      onKeyDown={handleKeyPress}
      onClick={() => inputRef.current?.focus()}
      ref={spotlightRef}
    >
      <div
        className="w-full h-12 sm:h-14 rounded-lg bg-transparent"
        grid="~ cols-8 sm:cols-11"
      >
        <div className="col-start-1 col-span-1 flex-center">
          <span className="i-bx:search ml-1 text-c-600 text-[28px]" />
        </div>
        <input
          ref={inputRef}
          className={`col-start-2 col-span-7 ${
            curDetails ? "sm:col-span-9" : "sm:col-span-10"
          } bg-transparent no-outline px-1`}
          text="c-black xl sm:2xl"
          placeholder="Spotlight Search"
          value={searchText}
          onChange={handleInputChange}
          autoFocus={true}
        />
        {curDetails && (
          <div className="hidden sm:flex col-start-11 col-span-1 flex-center">
            <img
              w-8
              src={curDetails.img}
              alt={curDetails.title}
              title={curDetails.title}
            />
          </div>
        )}
      </div>
      {searchText !== "" && (
        <div flex h-85 bg-transparent border="t menu">
          <div ref={resultsRef} w="32 sm:72" border="r menu" p="x-2.5" overflow-y-scroll>
            {appListJSX}
          </div>
          {curDetails && (
            <div className="flex-1 vstack">
              <div className="w-4/5 h-56" flex="center col" border="b menu">
                <img
                  w-32
                  src={curDetails.img}
                  alt={curDetails.title}
                  title={curDetails.title}
                />
                <div m="t-4" text="xl c-black">
                  {curDetails.title}
                </div>
                <div text="xs c-500">
                  {`Version: ${getRandom(0, 99)}.${getRandom(0, 999)}`}
                </div>
              </div>
              <div className="flex-1 hstack text-xs">
                <div w="1/2" text="right c-500">
                  <div>Kind</div>
                  <div>Size</div>
                  <div>Created</div>
                  <div>Modified</div>
                  <div>Last opened</div>
                </div>
                <div className="flex-1 pl-2 text-c-black">
                  <div>{curDetails.type === "app" ? "Application" : "Portfolio"}</div>
                  <div>{`${getRandom(0, 999)} G`}</div>
                  <div>{getRandomDate()}</div>
                  <div>{getRandomDate()}</div>
                  <div>{getRandomDate()}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
