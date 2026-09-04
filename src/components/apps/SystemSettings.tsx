import React, { useState } from "react";
import { useStore } from "~/stores";

const sections = [
  {
    id: "general",
    icon: "i-material-symbols:settings-outline-rounded",
    label: "General"
  },
  { id: "appearance", icon: "i-material-symbols:palette-outline", label: "Appearance" },
  { id: "display", icon: "i-material-symbols:monitor-outline", label: "Displays" },
  { id: "sound", icon: "i-material-symbols:volume-up-outline-rounded", label: "Sound" },
  { id: "network", icon: "i-material-symbols:wifi-rounded", label: "Network" },
  { id: "bluetooth", icon: "i-charm:bluetooth", label: "Bluetooth" },
  {
    id: "notifications",
    icon: "i-material-symbols:notifications-outline-rounded",
    label: "Notifications"
  },
  {
    id: "accessibility",
    icon: "i-material-symbols:accessibility-new-rounded",
    label: "Accessibility"
  }
];

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <label className="switch-toggle cursor-pointer" onClick={onChange}>
      <input type="checkbox" checked={checked} readOnly />
      <span className="slider-toggle" />
    </label>
  );
}

function SliderRow({
  label,
  value,
  onChange,
  min = 0,
  max = 100
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
}) {
  return (
    <div className="hstack justify-between py-3 border-b border-black/6 dark:border-white/6 last:border-0">
      <span className="text-sm text-c-black">{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-40 accent-blue-500"
      />
    </div>
  );
}

function SettingRow({
  label,
  detail,
  children
}: {
  label: string;
  detail?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="hstack justify-between py-3 border-b border-black/6 dark:border-white/6 last:border-0">
      <div>
        <div className="text-sm text-c-black">{label}</div>
        {detail && <div className="text-xs text-c-500 mt-0.5">{detail}</div>}
      </div>
      {children}
    </div>
  );
}

function PanelCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-glass bg-white/60 dark:bg-white/5 border border-black/8 dark:border-white/8 px-4 mb-4">
      {children}
    </div>
  );
}

export default function SystemSettings() {
  const [activeSection, setActiveSection] = useState("general");

  const dark = useStore((s) => s.dark);
  const wifi = useStore((s) => s.wifi);
  const bluetooth = useStore((s) => s.bluetooth);
  const airdrop = useStore((s) => s.airdrop);
  const volume = useStore((s) => s.volume);
  const brightness = useStore((s) => s.brightness);
  const dockSize = useStore((s) => s.dockSize);
  const dockMag = useStore((s) => s.dockMag);
  const toggleDark = useStore((s) => s.toggleDark);
  const toggleWIFI = useStore((s) => s.toggleWIFI);
  const toggleBluetooth = useStore((s) => s.toggleBluetooth);
  const toggleAirdrop = useStore((s) => s.toggleAirdrop);
  const setVolume = useStore((s) => s.setVolume);
  const setBrightness = useStore((s) => s.setBrightness);
  const setDockSize = useStore((s) => s.setDockSize);
  const setDockMag = useStore((s) => s.setDockMag);

  const renderPanel = () => {
    switch (activeSection) {
      case "general":
        return (
          <>
            <h2 className="text-lg font-semibold text-c-black mb-4">General</h2>
            <PanelCard>
              <SettingRow label="System Name" detail="Sriram's MacBook Pro">
                <span className="text-xs text-c-500">Mac16,1</span>
              </SettingRow>
              <SettingRow label="macOS" detail="Tahoe 26.0">
                <span className="text-xs text-blue-500">Up to date</span>
              </SettingRow>
              <SettingRow label="Storage" detail="1 TB Internal SSD">
                <div className="w-32 h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                  <div className="h-full w-1/3 bg-blue-500 rounded-full" />
                </div>
              </SettingRow>
            </PanelCard>
            <PanelCard>
              <SettingRow label="Dock Size">
                <input
                  type="range"
                  min={30}
                  max={80}
                  value={dockSize}
                  onChange={(e) => setDockSize(Number(e.target.value))}
                  className="w-32 accent-blue-500"
                />
              </SettingRow>
              <SettingRow label="Dock Magnification">
                <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.1}
                  value={dockMag}
                  onChange={(e) => setDockMag(Number(e.target.value))}
                  className="w-32 accent-blue-500"
                />
              </SettingRow>
            </PanelCard>
          </>
        );
      case "appearance":
        return (
          <>
            <h2 className="text-lg font-semibold text-c-black mb-4">Appearance</h2>
            <PanelCard>
              <SettingRow
                label="Dark Mode"
                detail="Switches the system between light and dark"
              >
                <Toggle checked={dark} onChange={toggleDark} />
              </SettingRow>
              <SettingRow
                label="Liquid Glass Effects"
                detail="Translucent material on system surfaces"
              >
                <span className="text-xs text-c-500">Always On</span>
              </SettingRow>
            </PanelCard>
            <PanelCard>
              <div className="py-3">
                <p className="text-sm text-c-black mb-3">Accent Color</p>
                <div className="hstack space-x-3">
                  {[
                    "bg-blue-500",
                    "bg-purple-500",
                    "bg-pink-500",
                    "bg-red-500",
                    "bg-orange-500",
                    "bg-yellow-500",
                    "bg-green-500"
                  ].map((c) => (
                    <div
                      key={c}
                      className={`size-6 rounded-full ${c} cursor-pointer ring-2 ring-transparent hover:ring-white transition-all`}
                    />
                  ))}
                </div>
              </div>
            </PanelCard>
          </>
        );
      case "display":
        return (
          <>
            <h2 className="text-lg font-semibold text-c-black mb-4">Displays</h2>
            <PanelCard>
              <SliderRow
                label="Brightness"
                value={brightness}
                onChange={setBrightness}
                min={10}
                max={100}
              />
              <SettingRow label="Resolution" detail="Best for display">
                <span className="text-xs text-c-500">2560 × 1600</span>
              </SettingRow>
              <SettingRow label="Refresh Rate">
                <span className="text-xs text-c-500">ProMotion</span>
              </SettingRow>
            </PanelCard>
          </>
        );
      case "sound":
        return (
          <>
            <h2 className="text-lg font-semibold text-c-black mb-4">Sound</h2>
            <PanelCard>
              <SliderRow label="Output Volume" value={volume} onChange={setVolume} />
              <SettingRow label="Output Device">
                <span className="text-xs text-c-500">MacBook Pro Speakers</span>
              </SettingRow>
              <SettingRow label="Input Device">
                <span className="text-xs text-c-500">MacBook Pro Microphone</span>
              </SettingRow>
            </PanelCard>
          </>
        );
      case "network":
        return (
          <>
            <h2 className="text-lg font-semibold text-c-black mb-4">Network</h2>
            <PanelCard>
              <SettingRow label="Wi-Fi" detail={wifi ? "Connected to Home" : "Off"}>
                <Toggle checked={wifi} onChange={toggleWIFI} />
              </SettingRow>
              <SettingRow label="AirDrop" detail={airdrop ? "Contacts Only" : "Off"}>
                <Toggle checked={airdrop} onChange={toggleAirdrop} />
              </SettingRow>
            </PanelCard>
            <PanelCard>
              <SettingRow label="IP Address">
                <span className="text-xs text-c-500">192.168.1.42</span>
              </SettingRow>
              <SettingRow label="Router">
                <span className="text-xs text-c-500">192.168.1.1</span>
              </SettingRow>
              <SettingRow label="DNS">
                <span className="text-xs text-c-500">1.1.1.1</span>
              </SettingRow>
            </PanelCard>
          </>
        );
      case "bluetooth":
        return (
          <>
            <h2 className="text-lg font-semibold text-c-black mb-4">Bluetooth</h2>
            <PanelCard>
              <SettingRow label="Bluetooth" detail={bluetooth ? "On" : "Off"}>
                <Toggle checked={bluetooth} onChange={toggleBluetooth} />
              </SettingRow>
            </PanelCard>
            {bluetooth && (
              <PanelCard>
                <p className="text-xs text-c-500 pt-3 pb-2">MY DEVICES</p>
                {["AirPods Pro", "Magic Mouse", "Magic Keyboard"].map((d) => (
                  <SettingRow key={d} label={d} detail="Connected">
                    <span className="text-xs text-green-500">●</span>
                  </SettingRow>
                ))}
              </PanelCard>
            )}
          </>
        );
      case "notifications":
        return (
          <>
            <h2 className="text-lg font-semibold text-c-black mb-4">Notifications</h2>
            <PanelCard>
              {["Messages", "Mail", "Reminders", "Calendar", "Safari", "Terminal"].map(
                (app) => (
                  <SettingRow key={app} label={app}>
                    <Toggle checked={true} onChange={() => {}} />
                  </SettingRow>
                )
              )}
            </PanelCard>
          </>
        );
      default:
        return (
          <div className="flex-center h-full text-c-500 text-sm">
            <span>Section coming soon</span>
          </div>
        );
    }
  };

  return (
    <div className="flex size-full bg-c-100 text-c-black">
      {/* Sidebar */}
      <div className="w-52 flex-shrink-0 h-full bg-white/50 dark:bg-gray-900/30 border-r border-black/8 dark:border-white/8 overflow-y-auto py-3">
        <div className="px-4 mb-3">
          <div className="hstack space-x-3 py-2">
            <div className="size-10 rounded-glass bg-gradient-to-br from-blue-400 to-purple-500 flex-center">
              <span className="i-ri:apple-fill text-white text-lg" />
            </div>
            <div>
              <div className="text-sm font-medium text-c-black">Sriram</div>
              <div className="text-xs text-c-500">Apple ID</div>
            </div>
          </div>
        </div>
        <div className="h-px bg-black/8 dark:bg-white/8 mx-3 mb-2" />
        {sections.map((s) => (
          <button
            key={s.id}
            onClick={() => setActiveSection(s.id)}
            className={`w-full hstack space-x-3 px-4 py-2 text-sm transition-colors duration-100 ${
              activeSection === s.id
                ? "bg-blue-500/15 dark:bg-blue-400/20 text-blue-600 dark:text-blue-400 rounded-lg mx-2 w-[calc(100%-1rem)]"
                : "text-c-black hover:bg-black/5 dark:hover:bg-white/5"
            }`}
          >
            <span className={`${s.icon} text-base`} />
            <span>{s.label}</span>
          </button>
        ))}
      </div>
      {/* Main panel */}
      <div className="flex-1 overflow-y-auto p-6">{renderPanel()}</div>
    </div>
  );
}
