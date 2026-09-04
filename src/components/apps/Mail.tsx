import React, { useState } from "react";

interface MailMessage {
  id: string;
  from: string;
  subject: string;
  preview: string;
  body: string;
  time: string;
  read: boolean;
  starred: boolean;
}

const sampleMail: MailMessage[] = [
  {
    id: "1",
    from: "GitHub Notifications",
    subject: "New pull request: feat/liquid-glass-ui",
    preview: "sriramkidambi opened a pull request in macos-portfolio",
    body: "sriramkidambi opened a pull request:\n\n**feat/liquid-glass-ui**\n\nThis PR upgrades the macOS portfolio to use the Liquid Glass design language from macOS 26 Tahoe.\n\nChanges:\n- Unified glass token system in UnoCSS\n- SVG displacement refraction component\n- 5 new default apps\n- Transparent menu bar\n- Floating Dock redesign",
    time: "9:41 AM",
    read: false,
    starred: true
  },
  {
    id: "2",
    from: "Apple Developer",
    subject: "macOS 26 Tahoe — Release Notes",
    preview: "New APIs for Liquid Glass, Metal 4, and App Intents are now available.",
    body: "Dear Developer,\n\nmacOS 26 Tahoe introduces powerful new APIs including:\n\n• Liquid Glass Material API\n• Metal 4 with MetalFX Frame Interpolation\n• App Intents for Spotlight Actions\n• Phone app Continuity APIs\n• Live Activities on Mac\n\nView the full release notes at developer.apple.com.",
    time: "Yesterday",
    read: true,
    starred: false
  },
  {
    id: "3",
    from: "Vercel",
    subject: "Your deployment is ready",
    preview: "macos-portfolio.vercel.app has been deployed successfully.",
    body: "Your project macos-portfolio was successfully deployed.\n\nDeployment URL: https://macos-portfolio.vercel.app\nBranch: main\nStatus: ✅ Ready\n\nBuild time: 43s",
    time: "Mon",
    read: true,
    starred: false
  },
  {
    id: "4",
    from: "Linear",
    subject: "Issue assigned: Upgrade to macOS 26 Tahoe",
    preview: "You were assigned an issue in the macos-portfolio project.",
    body: "You have been assigned:\n\n**Upgrade to macOS 26 Tahoe** (MAC-42)\nProject: macos-portfolio\nPriority: High\nAssignee: sriramkidambi\n\nDescription: Upgrade the portfolio to match the macOS 26 Tahoe Liquid Glass design language.",
    time: "Sun",
    read: true,
    starred: false
  },
  {
    id: "5",
    from: "Sriram Kidambi",
    subject: "Notes from WWDC 2025",
    preview: "Liquid Glass, Apple Intelligence updates, Phone on Mac — great session.",
    body: "Notes from WWDC 2025:\n\n**Liquid Glass** — new translucent material that reflects and refracts surroundings. Applies to dock, sidebars, toolbars, menus.\n\n**Menu bar** is now fully transparent in macOS Tahoe.\n\n**Phone app** arrives on Mac via Continuity.\n\n**Spotlight** — unified results + 100s of direct actions.\n\nApple Intelligence: Live Translation, smarter Shortcuts, Genmoji.",
    time: "Jun 9",
    read: true,
    starred: true
  }
];

const mailboxes = [
  {
    id: "inbox",
    label: "Inbox",
    icon: "i-material-symbols:inbox-outline-rounded",
    count: 1
  },
  {
    id: "starred",
    label: "Starred",
    icon: "i-material-symbols:star-outline-rounded",
    count: 2
  },
  {
    id: "sent",
    label: "Sent",
    icon: "i-material-symbols:send-outline-rounded",
    count: 0
  },
  {
    id: "drafts",
    label: "Drafts",
    icon: "i-material-symbols:draft-outline-rounded",
    count: 0
  },
  {
    id: "trash",
    label: "Trash",
    icon: "i-material-symbols:delete-outline-rounded",
    count: 0
  }
];

export default function Mail() {
  const [activeMailbox, setActiveMailbox] = useState("inbox");
  const [activeId, setActiveId] = useState<string | null>("1");
  const [messages, setMessages] = useState<MailMessage[]>(sampleMail);

  const filtered =
    activeMailbox === "starred" ? messages.filter((m) => m.starred) : messages;

  const active = messages.find((m) => m.id === activeId);

  const select = (id: string) => {
    setActiveId(id);
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, read: true } : m)));
  };

  const toggleStar = (id: string) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, starred: !m.starred } : m))
    );
  };

  return (
    <div className="flex size-full bg-c-100 text-c-black overflow-hidden">
      {/* Mailboxes sidebar */}
      <div className="w-44 flex-shrink-0 border-r border-black/8 dark:border-white/8 bg-white/50 dark:bg-gray-900/30 py-3">
        <p className="px-4 text-xs font-semibold text-c-400 uppercase tracking-wide mb-2">
          Mailboxes
        </p>
        {mailboxes.map((mb) => (
          <button
            key={mb.id}
            onClick={() => setActiveMailbox(mb.id)}
            className={`w-full hstack space-x-3 px-4 py-2 text-sm transition-colors ${
              activeMailbox === mb.id
                ? "bg-blue-500/15 text-blue-600 dark:text-blue-400 rounded-lg mx-2 w-[calc(100%-1rem)]"
                : "text-c-black hover:bg-black/4 dark:hover:bg-white/4"
            }`}
          >
            <span className={`${mb.icon} text-base`} />
            <span className="flex-1 text-left">{mb.label}</span>
            {mb.count > 0 && (
              <span className="text-xs font-medium text-blue-500">{mb.count}</span>
            )}
          </button>
        ))}
      </div>

      {/* Message list */}
      <div className="w-64 flex-shrink-0 border-r border-black/8 dark:border-white/8 flex flex-col bg-white/30 dark:bg-gray-900/10">
        <div className="px-3 py-3 border-b border-black/8 dark:border-white/8">
          <p className="text-base font-semibold text-c-black capitalize">
            {activeMailbox}
          </p>
        </div>
        <div className="flex-1 overflow-y-auto">
          {filtered.map((m) => (
            <button
              key={m.id}
              onClick={() => select(m.id)}
              className={`w-full px-3 py-2.5 text-left border-b border-black/4 dark:border-white/4 transition-colors ${
                activeId === m.id
                  ? "bg-blue-500/15"
                  : "hover:bg-black/4 dark:hover:bg-white/4"
              }`}
            >
              <div className="hstack justify-between">
                <span
                  className={`text-xs truncate ${m.read ? "text-c-500" : "font-semibold text-c-black"}`}
                >
                  {m.from}
                </span>
                <span className="text-xs text-c-400 ml-1 flex-shrink-0">{m.time}</span>
              </div>
              <div
                className={`text-xs mt-0.5 truncate ${m.read ? "text-c-500" : "font-medium text-c-black"}`}
              >
                {m.subject}
              </div>
              <div className="text-xs text-c-400 mt-0.5 truncate">{m.preview}</div>
              {!m.read && <div className="size-2 bg-blue-500 rounded-full mt-1" />}
            </button>
          ))}
        </div>
      </div>

      {/* Message body */}
      <div className="flex-1 flex flex-col min-w-0">
        {active ? (
          <>
            <div className="px-6 py-4 border-b border-black/8 dark:border-white/8 bg-white/40 dark:bg-gray-900/20">
              <div className="hstack justify-between">
                <h2 className="text-base font-semibold text-c-black">{active.subject}</h2>
                <button
                  onClick={() => toggleStar(active.id)}
                  className="text-xl text-c-400 hover:text-yellow-500 transition-colors"
                >
                  <span
                    className={
                      active.starred
                        ? "i-material-symbols:star-rounded text-yellow-500"
                        : "i-material-symbols:star-outline-rounded"
                    }
                  />
                </button>
              </div>
              <div className="text-xs text-c-500 mt-1">
                From: {active.from} · {active.time}
              </div>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-5">
              <pre className="text-sm text-c-black whitespace-pre-wrap font-sans leading-relaxed">
                {active.body}
              </pre>
            </div>
          </>
        ) : (
          <div className="flex-1 flex-center text-c-500 text-sm">Select a message</div>
        )}
      </div>
    </div>
  );
}
