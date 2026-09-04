import React, { useState } from "react";
import { useStore } from "~/stores";
import {
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  List,
  Search,
  Plus,
  Settings,
  Folder,
  File,
  HardDrive,
  Cloud,
  Clock,
  Image,
  Film,
  Music,
  FileText,
  Archive
} from "lucide-react";

export interface FinderItem {
  id: string;
  name: string;
  type: "folder" | "file";
  subtype?: "image" | "video" | "audio" | "document" | "archive" | "code" | "folder";
  dateModified: string;
  size?: string;
  children?: FinderItem[];
}

export interface FinderLocation {
  id: string;
  name: string;
  icon: React.ReactNode;
  path: string;
  items: FinderItem[];
}

const mockLocations: FinderLocation[] = [
  {
    id: "recents",
    name: "Recents",
    icon: <Clock className="w-4 h-4" />,
    path: "/Recents",
    items: []
  },
  {
    id: "desktop",
    name: "Desktop",
    icon: <Folder className="w-4 h-4" />,
    path: "/Users/user/Desktop",
    items: [
      {
        id: "d1",
        name: "Screenshot.png",
        type: "file",
        subtype: "image",
        dateModified: "Today",
        size: "2.4 MB"
      },
      {
        id: "d2",
        name: "Notes.txt",
        type: "file",
        subtype: "document",
        dateModified: "Yesterday",
        size: "12 KB"
      }
    ]
  },
  {
    id: "documents",
    name: "Documents",
    icon: <Folder className="w-4 h-4" />,
    path: "/Users/user/Documents",
    items: [
      {
        id: "doc1",
        name: "Projects",
        type: "folder",
        subtype: "folder",
        dateModified: "Today",
        children: [
          {
            id: "doc1-1",
            name: "macos-portfolio",
            type: "folder",
            subtype: "folder",
            dateModified: "Today",
            children: [
              {
                id: "doc1-1-1",
                name: "README.md",
                type: "file",
                subtype: "document",
                dateModified: "Today",
                size: "4 KB"
              },
              {
                id: "doc1-1-2",
                name: "package.json",
                type: "file",
                subtype: "code",
                dateModified: "Today",
                size: "2 KB"
              },
              {
                id: "doc1-1-3",
                name: "src",
                type: "folder",
                subtype: "folder",
                dateModified: "Today",
                children: []
              }
            ]
          },
          {
            id: "doc1-2",
            name: "design-notes.pdf",
            type: "file",
            subtype: "document",
            dateModified: "Yesterday",
            size: "890 KB"
          }
        ]
      },
      {
        id: "doc2",
        name: "Resume.pdf",
        type: "file",
        subtype: "document",
        dateModified: "Last week",
        size: "156 KB"
      },
      {
        id: "doc3",
        name: "Budget.xlsx",
        type: "file",
        subtype: "document",
        dateModified: "2 days ago",
        size: "45 KB"
      }
    ]
  },
  {
    id: "downloads",
    name: "Downloads",
    icon: <Folder className="w-4 h-4" />,
    path: "/Users/user/Downloads",
    items: [
      {
        id: "dl1",
        name: "installer.dmg",
        type: "file",
        subtype: "archive",
        dateModified: "Today",
        size: "45.6 MB"
      },
      {
        id: "dl2",
        name: "photo.jpg",
        type: "file",
        subtype: "image",
        dateModified: "Yesterday",
        size: "3.2 MB"
      },
      {
        id: "dl3",
        name: "presentation.key",
        type: "file",
        subtype: "document",
        dateModified: "3 days ago",
        size: "12.8 MB"
      }
    ]
  },
  {
    id: "applications",
    name: "Applications",
    icon: <Folder className="w-4 h-4" />,
    path: "/Applications",
    items: [
      {
        id: "app1",
        name: "Safari",
        type: "folder",
        subtype: "folder",
        dateModified: "Today",
        children: []
      },
      {
        id: "app2",
        name: "Notes",
        type: "folder",
        subtype: "folder",
        dateModified: "Today",
        children: []
      },
      {
        id: "app3",
        name: "Calendar",
        type: "folder",
        subtype: "folder",
        dateModified: "Today",
        children: []
      },
      {
        id: "app4",
        name: "Terminal",
        type: "folder",
        subtype: "folder",
        dateModified: "Today",
        children: []
      },
      {
        id: "app5",
        name: "System Settings",
        type: "folder",
        subtype: "folder",
        dateModified: "Today",
        children: []
      }
    ]
  },
  {
    id: "airdrop",
    name: "AirDrop",
    icon: <Cloud className="w-4 h-4" />,
    path: "/AirDrop",
    items: []
  },
  {
    id: "icloud",
    name: "iCloud Drive",
    icon: <Cloud className="w-4 h-4" />,
    path: "/iCloud",
    items: [
      {
        id: "ic1",
        name: "Documents",
        type: "folder",
        subtype: "folder",
        dateModified: "Today",
        children: []
      },
      {
        id: "ic2",
        name: "Photos",
        type: "folder",
        subtype: "folder",
        dateModified: "Today",
        children: []
      }
    ]
  }
];

const getItemIcon = (item: FinderItem) => {
  const baseClass = "w-12 h-12";

  if (item.type === "folder") {
    return (
      <div
        className={`${baseClass} bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center`}
      >
        <Folder className="w-8 h-8 text-blue-500 dark:text-blue-400" />
      </div>
    );
  }

  switch (item.subtype) {
    case "image":
      return (
        <div
          className={`${baseClass} bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center`}
        >
          <Image className="w-8 h-8 text-purple-500 dark:text-purple-400" />
        </div>
      );
    case "video":
      return (
        <div
          className={`${baseClass} bg-pink-100 dark:bg-pink-900/30 rounded-lg flex items-center justify-center`}
        >
          <Film className="w-8 h-8 text-pink-500 dark:text-pink-400" />
        </div>
      );
    case "audio":
      return (
        <div
          className={`${baseClass} bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center`}
        >
          <Music className="w-8 h-8 text-orange-500 dark:text-orange-400" />
        </div>
      );
    case "archive":
      return (
        <div
          className={`${baseClass} bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center`}
        >
          <Archive className="w-8 h-8 text-yellow-600 dark:text-yellow-500" />
        </div>
      );
    case "document":
    default:
      return (
        <div
          className={`${baseClass} bg-gray-100 dark:bg-gray-700/50 rounded-lg flex items-center justify-center`}
        >
          <FileText className="w-8 h-8 text-gray-500 dark:text-gray-400" />
        </div>
      );
  }
};

interface FinderSidebarProps {
  currentLocation: FinderLocation;
  onLocationChange: (location: FinderLocation) => void;
}

const FinderSidebar = ({ currentLocation, onLocationChange }: FinderSidebarProps) => {
  const dark = useStore((state) => state.dark);

  return (
    <div
      className={`w-52 flex flex-col border-r ${
        dark ? "bg-gray-800/50 border-gray-700" : "bg-gray-100/80 border-gray-200"
      }`}
    >
      <div className="p-3">
        <p
          className={`text-xs font-semibold uppercase tracking-wide mb-2 px-2 ${
            dark ? "text-gray-400" : "text-gray-500"
          }`}
        >
          Favorites
        </p>
        <ul className="space-y-0.5">
          {mockLocations.map((location) => (
            <li
              key={location.id}
              className={`flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer transition-colors ${
                currentLocation.id === location.id
                  ? dark
                    ? "bg-blue-600 text-white"
                    : "bg-blue-500 text-white"
                  : dark
                    ? "text-gray-200 hover:bg-gray-700/50"
                    : "text-gray-700 hover:bg-gray-200/80"
              }`}
              onClick={() => onLocationChange(location)}
            >
              <span
                className={
                  currentLocation.id === location.id
                    ? "text-white"
                    : dark
                      ? "text-gray-400"
                      : "text-gray-500"
                }
              >
                {location.icon}
              </span>
              <span className="text-sm font-medium truncate">{location.name}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-auto p-3 border-t border-gray-700/30">
        <p
          className={`text-xs font-semibold uppercase tracking-wide mb-2 px-2 ${
            dark ? "text-gray-400" : "text-gray-500"
          }`}
        >
          Locations
        </p>
        <ul className="space-y-0.5">
          <li
            className={`flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer transition-colors ${
              dark
                ? "text-gray-200 hover:bg-gray-700/50"
                : "text-gray-700 hover:bg-gray-200/80"
            }`}
          >
            <HardDrive className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-medium">Macintosh HD</span>
          </li>
          <li
            className={`flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer transition-colors ${
              dark
                ? "text-gray-200 hover:bg-gray-700/50"
                : "text-gray-700 hover:bg-gray-200/80"
            }`}
          >
            <Cloud className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-medium">Network</span>
          </li>
        </ul>
      </div>

      <div
        className={`p-3 border-t text-xs ${
          dark ? "border-gray-700/30 text-gray-500" : "border-gray-200 text-gray-400"
        }`}
      >
        <div className="flex justify-between">
          <span>Available: 256 GB</span>
          <span>Total: 512 GB</span>
        </div>
        <div
          className={`mt-1 h-1 rounded-full overflow-hidden ${
            dark ? "bg-gray-700" : "bg-gray-300"
          }`}
        >
          <div className="h-full bg-blue-500 w-1/2"></div>
        </div>
      </div>
    </div>
  );
};

interface FinderContentProps {
  location: FinderLocation;
  viewMode: "grid" | "list";
  onNavigate: (item: FinderItem) => void;
}

const FinderContent = ({ location, viewMode, onNavigate }: FinderContentProps) => {
  const dark = useStore((state) => state.dark);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  if (viewMode === "grid") {
    return (
      <div className="flex-1 p-4 overflow-y-auto">
        {location.items.length === 0 ? (
          <div
            className={`h-full flex flex-col items-center justify-center ${
              dark ? "text-gray-500" : "text-gray-400"
            }`}
          >
            <Folder className="w-16 h-16 mb-4 opacity-30" />
            <p className="text-lg">This folder is empty</p>
          </div>
        ) : (
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4">
            {location.items.map((item) => (
              <div
                key={item.id}
                className={`flex flex-col items-center p-3 rounded-xl cursor-pointer transition-all ${
                  selectedItem === item.id
                    ? dark
                      ? "bg-blue-600/20 ring-2 ring-blue-500"
                      : "bg-blue-100 ring-2 ring-blue-500"
                    : dark
                      ? "hover:bg-gray-700/50"
                      : "hover:bg-gray-100"
                }`}
                onClick={() => setSelectedItem(item.id)}
                onDoubleClick={() => {
                  if (item.type === "folder") {
                    setSelectedItem(null);
                    onNavigate(item);
                  }
                }}
              >
                {getItemIcon(item)}
                <span
                  className={`mt-2 text-xs text-center font-medium w-full break-words line-clamp-2 ${
                    dark ? "text-gray-200" : "text-gray-700"
                  }`}
                >
                  {item.name}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {location.items.length === 0 ? (
        <div
          className={`h-full flex flex-col items-center justify-center ${
            dark ? "text-gray-500" : "text-gray-400"
          }`}
        >
          <Folder className="w-16 h-16 mb-4 opacity-30" />
          <p className="text-lg">This folder is empty</p>
        </div>
      ) : (
        <table className={`w-full text-sm ${dark ? "text-gray-200" : "text-gray-700"}`}>
          <thead
            className={`sticky top-0 ${
              dark ? "bg-gray-800/80 border-gray-700" : "bg-gray-50/80 border-gray-200"
            } border-b`}
          >
            <tr>
              <th className="text-left p-3 font-medium">Name</th>
              <th className="text-left p-3 font-medium">Date Modified</th>
              <th className="text-right p-3 font-medium">Size</th>
              <th className="text-right p-3 font-medium">Kind</th>
            </tr>
          </thead>
          <tbody>
            {location.items.map((item) => (
              <tr
                key={item.id}
                className={`cursor-pointer transition-colors border-b ${
                  selectedItem === item.id
                    ? dark
                      ? "bg-blue-600/20"
                      : "bg-blue-100"
                    : dark
                      ? "hover:bg-gray-700/30 border-gray-700/50"
                      : "hover:bg-gray-50 border-gray-100"
                }`}
                onClick={() => setSelectedItem(item.id)}
                onDoubleClick={() => {
                  if (item.type === "folder") {
                    setSelectedItem(null);
                    onNavigate(item);
                  }
                }}
              >
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6">{getItemIcon(item)}</div>
                    <span className="font-medium">{item.name}</span>
                  </div>
                </td>
                <td className={`p-3 ${dark ? "text-gray-400" : "text-gray-500"}`}>
                  {item.dateModified}
                </td>
                <td
                  className={`p-3 text-right ${dark ? "text-gray-400" : "text-gray-500"}`}
                >
                  {item.size || "-"}
                </td>
                <td
                  className={`p-3 text-right ${dark ? "text-gray-400" : "text-gray-500"}`}
                >
                  {item.type === "folder" ? "Folder" : item.subtype || "Document"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

interface FinderToolbarProps {
  currentLocation: FinderLocation;
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
  onBack: () => void;
  onForward: () => void;
}

const FinderToolbar = ({
  currentLocation,
  viewMode,
  onViewModeChange,
  onBack,
  onForward
}: FinderToolbarProps) => {
  const dark = useStore((state) => state.dark);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div
      className={`h-12 flex items-center justify-between px-3 border-b ${
        dark
          ? "bg-gray-900/95 border-gray-700 backdrop-blur"
          : "bg-white/95 border-gray-200 backdrop-blur"
      }`}
    >
      <div className="flex items-center gap-1">
        <button
          className={`p-1.5 rounded-md transition-colors ${
            dark
              ? "text-gray-400 hover:bg-gray-800 hover:text-gray-200"
              : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
          }`}
          onClick={onBack}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          className={`p-1.5 rounded-md transition-colors ${
            dark
              ? "text-gray-400 hover:bg-gray-800 hover:text-gray-200"
              : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
          }`}
          onClick={onForward}
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        <div
          className={`flex items-center gap-2 px-3 py-1.5 mx-2 rounded-lg ${
            dark ? "bg-gray-800" : "bg-gray-100"
          }`}
        >
          {currentLocation.icon}
          <span
            className={`text-sm font-medium ${dark ? "text-gray-200" : "text-gray-700"}`}
          >
            {currentLocation.name}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div
          className={`flex items-center gap-1 px-2 py-1.5 rounded-lg ${dark ? "bg-gray-800" : "bg-gray-100"}`}
        >
          <button
            className={`p-1 rounded transition-colors ${
              viewMode === "grid"
                ? dark
                  ? "bg-gray-700 text-blue-400"
                  : "bg-white text-blue-500 shadow-sm"
                : dark
                  ? "text-gray-400 hover:bg-gray-700"
                  : "text-gray-500 hover:bg-white"
            }`}
            onClick={() => onViewModeChange("grid")}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            className={`p-1 rounded transition-colors ${
              viewMode === "list"
                ? dark
                  ? "bg-gray-700 text-blue-400"
                  : "bg-white text-blue-500 shadow-sm"
                : dark
                  ? "text-gray-400 hover:bg-gray-700"
                  : "text-gray-500 hover:bg-white"
            }`}
            onClick={() => onViewModeChange("list")}
          >
            <List className="w-4 h-4" />
          </button>
        </div>

        <div
          className={`relative ${dark ? "bg-gray-800" : "bg-gray-100"} rounded-lg flex items-center`}
        >
          <Search
            className={`w-4 h-4 absolute left-2 ${dark ? "text-gray-500" : "text-gray-400"}`}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search"
            className={`pl-8 pr-3 py-1.5 w-40 text-sm rounded-lg outline-none transition-all focus:w-56 ${
              dark
                ? "bg-gray-800 text-gray-200 placeholder-gray-500"
                : "bg-gray-100 text-gray-700 placeholder-gray-400"
            }`}
          />
        </div>

        <button
          className={`p-1.5 rounded-md transition-colors ${
            dark
              ? "text-gray-400 hover:bg-gray-800 hover:text-gray-200"
              : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
          }`}
        >
          <Plus className="w-4 h-4" />
        </button>

        <button
          className={`p-1.5 rounded-md transition-colors ${
            dark
              ? "text-gray-400 hover:bg-gray-800 hover:text-gray-200"
              : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
          }`}
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

const Finder = () => {
  const dark = useStore((state) => state.dark);
  const [currentLocation, setCurrentLocation] = useState<FinderLocation>(
    mockLocations[0]
  );
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [history, setHistory] = useState<FinderLocation[]>([mockLocations[0]]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const handleLocationChange = (location: FinderLocation) => {
    setCurrentLocation(location);
    setHistory([...history.slice(0, historyIndex + 1), location]);
    setHistoryIndex(historyIndex + 1);
  };

  const handleFolderNavigate = (item: FinderItem) => {
    if (!item.children) return;
    const virtualLocation: FinderLocation = {
      id: item.id,
      name: item.name,
      icon: <Folder className="w-4 h-4" />,
      path: `${currentLocation.path}/${item.name}`,
      items: item.children
    };
    handleLocationChange(virtualLocation);
  };

  const handleBack = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setCurrentLocation(history[newIndex]);
    }
  };

  const handleForward = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setCurrentLocation(history[newIndex]);
    }
  };

  return (
    <div className={`w-full h-full flex flex-col ${dark ? "bg-gray-900" : "bg-white"}`}>
      <FinderToolbar
        currentLocation={currentLocation}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onBack={handleBack}
        onForward={handleForward}
      />
      <div className="flex-1 flex overflow-hidden">
        <FinderSidebar
          currentLocation={currentLocation}
          onLocationChange={handleLocationChange}
        />
        <FinderContent
          location={currentLocation}
          viewMode={viewMode}
          onNavigate={handleFolderNavigate}
        />
      </div>

      <div
        className={`h-6 flex items-center justify-between px-3 text-xs border-t ${
          dark
            ? "bg-gray-900 border-gray-700 text-gray-500"
            : "bg-white border-gray-200 text-gray-400"
        }`}
      >
        <span>
          {currentLocation.items.length} items,{" "}
          {currentLocation.items.filter((i) => i.type === "folder").length} folders
        </span>
        <div className="flex items-center gap-3">
          <span>Selected: {currentLocation.name}</span>
          <span>{currentLocation.path}</span>
        </div>
      </div>
    </div>
  );
};

export default Finder;
