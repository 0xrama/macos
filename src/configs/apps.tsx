import React, { Suspense } from "react";
import { appBarHeight } from "~/utils";
import type { AppsData } from "~/types";

// Lazy load all app components for code-splitting
const AppleNotes = React.lazy(() => import("~/components/apps/AppleNotes"));
const Calendar = React.lazy(() => import("~/components/apps/Calendar"));
const FaceTime = React.lazy(() => import("~/components/apps/FaceTime"));
const Finder = React.lazy(() => import("~/components/apps/Finder"));
const Github = React.lazy(() => import("~/components/apps/Github"));
const Spotify = React.lazy(() => import("~/components/apps/Spotify"));
const Terminal = React.lazy(() => import("~/components/apps/Terminal"));
const Safari = React.lazy(() => import("~/components/apps/Safari"));
const SystemSettings = React.lazy(() => import("~/components/apps/SystemSettings"));
const Messages = React.lazy(() => import("~/components/apps/Messages"));
const Mail = React.lazy(() => import("~/components/apps/Mail"));
const Reminders = React.lazy(() => import("~/components/apps/Reminders"));
const Phone = React.lazy(() => import("~/components/apps/Phone"));

// Loading fallback for lazy components
const AppLoader = () => (
  <div className="w-full h-full flex-center bg-c-100">
    <div className="animate-pulse text-c-500">Loading...</div>
  </div>
);

// Wrapper to add Suspense boundary around lazy components
const withSuspense = (Component: React.LazyExoticComponent<React.ComponentType<any>>) => (
  <Suspense fallback={<AppLoader />}>
    <Component />
  </Suspense>
);

const apps: AppsData[] = [
  {
    id: "launchpad",
    title: "Launchpad",
    desktop: false,
    img: "img/icons/launchpad.png"
  },
  {
    id: "finder",
    title: "Finder",
    desktop: true,
    width: 900,
    height: 600,
    minWidth: 600,
    minHeight: 400,
    img: "img/icons/finder-t.png",
    content: withSuspense(Finder)
  },
  {
    id: "calendar",
    title: "Calendar",
    desktop: true,
    width: 700,
    height: 500,
    show: true,
    x: 100,
    y: 20,
    img: "img/icons/calendar-t.png",
    content: withSuspense(Calendar)
  },
  {
    id: "notes",
    title: "Notes",
    desktop: true,
    width: 860,
    height: 500,
    show: true,
    y: -40,
    img: "img/icons/notes-t.png",
    content: withSuspense(AppleNotes)
  },
  {
    id: "safari",
    title: "Safari",
    desktop: true,
    width: 1024,
    minWidth: 375,
    minHeight: 200,
    x: -20,
    img: "img/icons/safari-t.png",
    content: withSuspense(Safari)
  },
  {
    id: "facetime",
    title: "FaceTime",
    desktop: true,
    img: "img/icons/facetime-t.png",
    width: 500 * 1.7,
    height: 500 + appBarHeight,
    minWidth: 350 * 1.7,
    minHeight: 350 + appBarHeight,
    aspectRatio: 1.7,
    x: -80,
    y: 20,
    content: withSuspense(FaceTime)
  },
  {
    id: "terminal",
    title: "Terminal",
    desktop: true,
    img: "img/icons/terminal.png",
    content: withSuspense(Terminal)
  },
  {
    id: "spotify",
    title: "Spotify",
    desktop: true,
    width: 900,
    height: 600,
    minWidth: 600,
    minHeight: 400,
    img: "img/icons/spotify.svg",
    content: withSuspense(Spotify)
  },
  {
    id: "github",
    title: "Github",
    desktop: true,
    width: 1024,
    height: 700,
    minWidth: 600,
    minHeight: 400,
    img: "img/icons/github.png",
    content: withSuspense(Github)
  },
  {
    id: "phone",
    title: "Phone",
    desktop: true,
    width: 420,
    height: 620,
    minWidth: 380,
    minHeight: 520,
    img: "img/icons/phone-t.png",
    content: withSuspense(Phone)
  },
  {
    id: "messages",
    title: "Messages",
    desktop: true,
    width: 900,
    height: 600,
    minWidth: 640,
    minHeight: 420,
    img: "img/icons/messages-t.png",
    content: withSuspense(Messages)
  },
  {
    id: "mail",
    title: "Mail",
    desktop: true,
    width: 1000,
    height: 640,
    minWidth: 720,
    minHeight: 440,
    img: "img/icons/mail-t.png",
    content: withSuspense(Mail)
  },
  {
    id: "reminders",
    title: "Reminders",
    desktop: true,
    width: 780,
    height: 560,
    minWidth: 560,
    minHeight: 400,
    img: "img/icons/reminders-t.png",
    content: withSuspense(Reminders)
  },
  {
    id: "settings",
    title: "System Settings",
    desktop: true,
    width: 800,
    height: 600,
    minWidth: 640,
    minHeight: 440,
    img: "img/icons/system-settings-t.png",
    content: withSuspense(SystemSettings)
  }
];

export default apps;
