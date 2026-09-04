import React, { useState, useRef, useEffect } from "react";

interface Message {
  id: string;
  from: "me" | "them";
  text: string;
  time: string;
}

interface Thread {
  id: string;
  name: string;
  avatar: string;
  lastMsg: string;
  time: string;
  unread: number;
  messages: Message[];
}

const initialThreads: Thread[] = [
  {
    id: "t1",
    name: "Alex Chen",
    avatar: "AC",
    lastMsg: "Sounds good, see you then!",
    time: "9:41 AM",
    unread: 2,
    messages: [
      {
        id: "1",
        from: "them",
        text: "Hey! Are you free for lunch tomorrow?",
        time: "9:30 AM"
      },
      {
        id: "2",
        from: "me",
        text: "Yeah, totally free. Where are you thinking?",
        time: "9:35 AM"
      },
      { id: "3", from: "them", text: "That new ramen place on 5th?", time: "9:38 AM" },
      { id: "4", from: "them", text: "Sounds good, see you then!", time: "9:41 AM" }
    ]
  },
  {
    id: "t2",
    name: "Mom",
    avatar: "M",
    lastMsg: "Call me when you get a chance",
    time: "Yesterday",
    unread: 1,
    messages: [
      {
        id: "1",
        from: "them",
        text: "How's everything going?",
        time: "Yesterday 6:00 PM"
      },
      {
        id: "2",
        from: "me",
        text: "All good! Busy with work but good.",
        time: "Yesterday 6:15 PM"
      },
      {
        id: "3",
        from: "them",
        text: "Call me when you get a chance",
        time: "Yesterday 6:20 PM"
      }
    ]
  },
  {
    id: "t3",
    name: "Dev Team",
    avatar: "DT",
    lastMsg: "PR is ready for review",
    time: "Mon",
    unread: 0,
    messages: [
      { id: "1", from: "them", text: "Can someone review my PR?", time: "Mon 2:00 PM" },
      { id: "2", from: "me", text: "On it, give me 10 mins", time: "Mon 2:05 PM" },
      { id: "3", from: "them", text: "PR is ready for review", time: "Mon 3:00 PM" }
    ]
  },
  {
    id: "t4",
    name: "Priya",
    avatar: "P",
    lastMsg: "Check out this article I found",
    time: "Sun",
    unread: 0,
    messages: [
      {
        id: "1",
        from: "them",
        text: "Check out this article I found",
        time: "Sun 11:00 AM"
      },
      { id: "2", from: "me", text: "Cool, thanks for sharing!", time: "Sun 11:30 AM" }
    ]
  }
];

function AvatarBubble({ initials, color }: { initials: string; color: string }) {
  return (
    <div
      className={`size-10 rounded-full flex-center text-white font-semibold text-sm flex-shrink-0 ${color}`}
    >
      {initials}
    </div>
  );
}

const avatarColors = [
  "bg-blue-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-green-500",
  "bg-orange-500"
];

export default function Messages() {
  const [threads, setThreads] = useState<Thread[]>(initialThreads);
  const [activeId, setActiveId] = useState<string>("t1");
  const [input, setInput] = useState("");
  const messagesScrollRef = useRef<HTMLDivElement>(null);

  const active = threads.find((t) => t.id === activeId)!;

  const selectThread = (id: string) => {
    setActiveId(id);
    setThreads((prev) => prev.map((t) => (t.id === id ? { ...t, unread: 0 } : t)));
  };

  const send = () => {
    if (!input.trim()) return;
    const msg: Message = {
      id: Date.now().toString(),
      from: "me",
      text: input.trim(),
      time: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
    };
    setThreads((prev) =>
      prev.map((t) =>
        t.id === activeId
          ? { ...t, messages: [...t.messages, msg], lastMsg: msg.text, time: msg.time }
          : t
      )
    );
    setInput("");
  };

  useEffect(() => {
    // Scroll only the messages pane itself — never use scrollIntoView here,
    // as it bubbles up and scrolls the window boundary container.
    const el = messagesScrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [activeId, active?.messages.length]);

  return (
    <div className="flex size-full bg-c-100 text-c-black overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 flex-shrink-0 border-r border-black/8 dark:border-white/8 flex flex-col bg-white/50 dark:bg-gray-900/30">
        <div className="px-4 py-3 border-b border-black/8 dark:border-white/8">
          <div className="text-base font-semibold text-c-black">Messages</div>
          <div className="mt-2 hstack bg-black/6 dark:bg-white/8 rounded-lg px-2 py-1.5 space-x-2">
            <span className="i-bx:search text-c-500 text-sm" />
            <input
              className="flex-1 bg-transparent text-sm no-outline text-c-black placeholder:text-c-400"
              placeholder="Search"
            />
          </div>
        </div>
        <div className="flex-1 min-h-0 overflow-y-auto">
          {threads.map((t, i) => (
            <button
              key={t.id}
              onClick={() => selectThread(t.id)}
              className={`w-full hstack space-x-3 px-3 py-2.5 text-left transition-colors ${
                activeId === t.id
                  ? "bg-blue-500/15 dark:bg-blue-400/15"
                  : "hover:bg-black/4 dark:hover:bg-white/4"
              }`}
            >
              <AvatarBubble
                initials={t.avatar}
                color={avatarColors[i % avatarColors.length]}
              />
              <div className="flex-1 min-w-0">
                <div className="hstack justify-between">
                  <span className="text-sm font-medium text-c-black truncate">
                    {t.name}
                  </span>
                  <span className="text-xs text-c-500 ml-2 flex-shrink-0">{t.time}</span>
                </div>
                <div className="hstack justify-between mt-0.5">
                  <span className="text-xs text-c-500 truncate">{t.lastMsg}</span>
                  {t.unread > 0 && (
                    <span className="ml-2 flex-shrink-0 size-4 bg-blue-500 text-white text-[10px] rounded-full flex-center">
                      {t.unread}
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Thread */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="px-4 py-3 border-b border-black/8 dark:border-white/8 hstack space-x-3 bg-white/40 dark:bg-gray-900/20">
          <AvatarBubble
            initials={active.avatar}
            color={
              avatarColors[
                threads.findIndex((t) => t.id === activeId) % avatarColors.length
              ]
            }
          />
          <div>
            <div className="text-sm font-semibold text-c-black">{active.name}</div>
            <div className="text-xs text-c-500">iMessage</div>
          </div>
        </div>

        {/* Messages */}
        <div
          ref={messagesScrollRef}
          className="flex-1 min-h-0 overflow-y-auto px-4 py-4 space-y-2"
        >
          {active.messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.from === "me" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs px-3.5 py-2 rounded-[18px] text-sm leading-snug ${
                  msg.from === "me"
                    ? "bg-blue-500 text-white rounded-br-md"
                    : "bg-white/70 dark:bg-gray-800/70 text-c-black rounded-bl-md border border-black/6 dark:border-white/6"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="px-4 pb-4 pt-2">
          <div className="hstack space-x-2 bg-white/60 dark:bg-gray-800/40 border border-black/10 dark:border-white/10 rounded-full px-4 py-2">
            <input
              className="flex-1 bg-transparent text-sm no-outline text-c-black placeholder:text-c-400"
              placeholder="iMessage"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
            />
            <button
              onClick={send}
              disabled={!input.trim()}
              className="size-6 bg-blue-500 disabled:bg-c-300 text-white rounded-full flex-center transition-colors"
            >
              <span className="i-material-symbols:arrow-upward-rounded text-sm" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
