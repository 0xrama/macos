import React, { useState } from "react";
import websites from "~/configs/websites";
import wallpapers from "~/configs/wallpapers";
import { checkURL } from "~/utils";
import { useStore } from "~/stores";
import type { SiteSectionData, SiteData } from "~/types";
import { ChevronLeft, ChevronRight, Share, Copy, Shield, Sidebar } from "lucide-react";

interface SafariState {
  goURL: string;
  currentURL: string;
}

interface SafariProps {
  width?: number;
}

interface NavProps {
  width: number;
  setGoURL: (url: string) => void;
}

interface NavSectionProps extends NavProps {
  section: SiteSectionData;
}

const NavSection = ({ width, section, setGoURL }: NavSectionProps) => {
  const grid = width < 640 ? "grid-cols-4" : "grid-cols-9";
  const dark = useStore((state) => state.dark);

  return (
    <div className="max-w-screen-md mx-auto py-8 px-4">
      <h2
        className={`text-xl sm:text-2xl font-medium mb-4 ${dark ? "text-gray-100" : "text-gray-900"}`}
      >
        {section.title}
      </h2>
      <div className={`grid ${grid} gap-4`}>
        {section.sites.map((site: SiteData) => (
          <div
            key={`safari-nav-${site.id}`}
            className={`h-28 flex flex-col items-center justify-center backdrop-blur rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer
              ${dark ? "bg-gray-800/50 hover:bg-gray-800/70" : "bg-white/50 hover:bg-white/70"}`}
            onClick={
              site.inner ? () => setGoURL(site.link) : () => window.open(site.link)
            }
          >
            <div
              className={`w-16 h-16 rounded-md overflow-hidden flex items-center justify-center
              ${dark ? "bg-gray-700" : "bg-white"}`}
            >
              {site.img ? (
                <img
                  src={site.img}
                  alt={site.title}
                  title={site.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className={`text-lg ${dark ? "text-gray-100" : "text-gray-900"}`}>
                  {site.title}
                </span>
              )}
            </div>
            <span
              className={`mt-2 text-sm text-center ${dark ? "text-gray-300" : "text-gray-700"}`}
            >
              {site.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const numTracker = Math.floor(Math.random() * 99 + 1);

const NavPage = ({ width, setGoURL }: NavProps) => {
  const dark = useStore((state) => state.dark);

  const grid = width < 640 ? "grid-cols-4" : "grid-cols-8";
  const span = width < 640 ? "col-span-3" : "col-span-7";

  return (
    <div
      className="w-full safari-content overflow-y-scroll bg-center bg-cover text-c-black"
      style={{
        backgroundImage: `url(${dark ? wallpapers.night : wallpapers.day})`
      }}
    >
      <div className="w-full min-h-full pt-8 bg-c-100/80 backdrop-blur-2xl">
        {/* Favorites */}
        <NavSection section={websites.favorites} setGoURL={setGoURL} width={width} />

        {/* Frequently Visited */}
        <NavSection section={websites.freq} setGoURL={setGoURL} width={width} />

        {/* Privacy Report */}
        <div className="mx-auto w-full max-w-screen-md" p="t-8 x-4 b-16">
          <div font="medium" text="xl sm:2xl">
            Privacy Report
          </div>
          <div
            className={`h-16 w-full mt-4 grid ${grid} shadow-md rounded-xl text-sm`}
            bg="gray-50/70 dark:gray-600/50"
          >
            <div className="col-start-1 col-span-1 flex-center space-x-2">
              <span className="i-fa-solid:shield-alt text-2xl" />
              <span className="text-xl">{numTracker}</span>
            </div>
            <div className={`col-start-2 ${span} hstack px-2`}>
              In the last seven days, Safari has prevent {numTracker} tracker from
              profiling you.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const NoInternetPage = () => {
  const dark = useStore((state) => state.dark);

  return (
    <div
      className="w-full safari-content bg-blue-50 overflow-y-scroll bg-center bg-cover"
      style={{
        backgroundImage: `url(${dark ? wallpapers.night : wallpapers.day})`
      }}
    >
      <div className="w-full h-full pb-10 backdrop-blur-2xl flex-center text-c-600 bg-c-100/80">
        <div className="text-center">
          <div className="text-2xl font-bold">You Are Not Connected to the Internet</div>
          <div className="pt-4 text-sm">
            This page can't be displayed because your computer is currently offline.
          </div>
        </div>
      </div>
    </div>
  );
};

const Safari = ({ width }: SafariProps) => {
  const wifi = useStore((state) => state.wifi);
  const dark = useStore((state) => state.dark);
  const [state, setState] = useState<SafariState>({
    goURL: "",
    currentURL: ""
  });

  const setGoURL = (url: string) => {
    const isValid = checkURL(url);

    if (isValid) {
      if (url.substring(0, 7) !== "http://" && url.substring(0, 8) !== "https://")
        url = `https://${url}`;
    } else if (url !== "") {
      url = `https://www.bing.com/search?q=${url}`;
    }

    setState({
      goURL: url,
      currentURL: url
    });
  };

  const pressURL = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") setGoURL(e.currentTarget.value);
  };

  const grid = (width as number) < 640 ? "grid-cols-2" : "grid-cols-3";
  const hideLast = (width as number) < 640 ? "hidden" : "flex";

  return (
    <div className="w-full h-full">
      <div
        className={`h-12 grid ${grid} items-center backdrop-blur border-b
        ${dark ? "bg-gray-900/95 border-gray-700" : "bg-white/95 border-gray-200"}`}
      >
        <div className="flex items-center px-2 space-x-2">
          <button
            className={`p-1.5 rounded-md transition-colors ${
              state.goURL === ""
                ? "text-gray-500 dark:text-gray-600 cursor-not-allowed"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
            onClick={() => setGoURL("")}
            disabled={state.goURL === ""}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            className="p-1.5 rounded-md text-gray-500 dark:text-gray-600 cursor-not-allowed"
            disabled
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            className={`p-1.5 rounded-md transition-colors text-gray-700 dark:text-gray-300 
              hover:bg-gray-100 dark:hover:bg-gray-800`}
          >
            <Sidebar className="w-4 h-4" />
          </button>
        </div>
        <div className="flex items-center space-x-2 px-2">
          <button
            className={`p-1.5 rounded-md transition-colors text-gray-700 dark:text-gray-300 
            hover:bg-gray-100 dark:hover:bg-gray-800 -ml-10`}
          >
            <Shield className="w-4 h-4" />
          </button>
          <input
            type="text"
            value={state.currentURL}
            onChange={(e) => setState({ ...state, currentURL: e.target.value })}
            onKeyPress={pressURL}
            className={`w-full h-8 px-3 rounded-md text-sm text-center transition-colors outline-none
              ${
                dark
                  ? "bg-gray-800 text-gray-100 border-gray-700 focus:border-blue-500"
                  : "bg-gray-100 text-gray-900 border-transparent focus:border-blue-400"
              } border focus:bg-opacity-100`}
            placeholder="Search or enter website name"
          />
        </div>
        <div className={`${hideLast} justify-end space-x-2 px-2`}>
          <button
            className={`p-1.5 rounded-md transition-colors ${
              state.goURL === ""
                ? "text-gray-500 dark:text-gray-600 cursor-not-allowed"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
            disabled={state.goURL === ""}
          >
            <Share className="w-4 h-4" />
          </button>
          <button
            className={`p-1.5 rounded-md transition-colors text-gray-700 dark:text-gray-300 
            hover:bg-gray-100 dark:hover:bg-gray-800`}
          >
            <Copy className="w-4 h-4" />
          </button>
        </div>
      </div>

      {wifi ? (
        state.goURL === "" ? (
          <NavPage setGoURL={setGoURL} width={width as number} />
        ) : (
          <iframe
            title="Safari clone browser"
            src={state.goURL}
            className={`safari-content w-full ${dark ? "bg-gray-900" : "bg-white"}`}
          />
        )
      ) : (
        <NoInternetPage />
      )}
    </div>
  );
};

export default Safari;
