import React, { useState } from "react";

interface Contact {
  id: string;
  name: string;
  number: string;
  avatar: string;
  color: string;
}

interface CallRecord {
  id: string;
  contact: string;
  type: "incoming" | "outgoing" | "missed";
  time: string;
}

const contacts: Contact[] = [
  {
    id: "c1",
    name: "Alex Chen",
    number: "+1 (415) 555-0142",
    avatar: "AC",
    color: "bg-blue-500"
  },
  {
    id: "c2",
    name: "Mom",
    number: "+1 (408) 555-0199",
    avatar: "M",
    color: "bg-purple-500"
  },
  {
    id: "c3",
    name: "Priya Sharma",
    number: "+1 (650) 555-0176",
    avatar: "PS",
    color: "bg-pink-500"
  },
  {
    id: "c4",
    name: "Dev Team Lead",
    number: "+1 (206) 555-0121",
    avatar: "DL",
    color: "bg-green-500"
  },
  {
    id: "c5",
    name: "Sriram Kidambi",
    number: "+1 (415) 555-0100",
    avatar: "SK",
    color: "bg-orange-500"
  }
];

const recents: CallRecord[] = [
  { id: "1", contact: "Alex Chen", type: "incoming", time: "9:41 AM" },
  { id: "2", contact: "Mom", type: "outgoing", time: "Yesterday" },
  { id: "3", contact: "Priya Sharma", type: "missed", time: "Yesterday" },
  { id: "4", contact: "Dev Team Lead", type: "outgoing", time: "Monday" },
  { id: "5", contact: "Alex Chen", type: "incoming", time: "Monday" }
];

const tabs = [
  {
    id: "recents",
    label: "Recents",
    icon: "i-material-symbols:schedule-outline-rounded"
  },
  {
    id: "contacts",
    label: "Contacts",
    icon: "i-material-symbols:person-outline-rounded"
  },
  { id: "keypad", label: "Keypad", icon: "i-material-symbols:dialpad" }
];

const keypadKeys = [
  { d: "1", l: "" },
  { d: "2", l: "ABC" },
  { d: "3", l: "DEF" },
  { d: "4", l: "GHI" },
  { d: "5", l: "JKL" },
  { d: "6", l: "MNO" },
  { d: "7", l: "PQRS" },
  { d: "8", l: "TUV" },
  { d: "9", l: "WXYZ" },
  { d: "*", l: "" },
  { d: "0", l: "+" },
  { d: "#", l: "" }
];

function typeIcon(type: CallRecord["type"]) {
  if (type === "incoming")
    return "i-material-symbols:call-received-rounded text-green-500";
  if (type === "outgoing") return "i-material-symbols:call-made-rounded text-c-500";
  return "i-material-symbols:call-missed-rounded text-red-500";
}

export default function Phone() {
  const [tab, setTab] = useState("recents");
  const [dialed, setDialed] = useState("");
  const [calling, setCalling] = useState<Contact | null>(null);

  const startCall = (c: Contact) => {
    setCalling(c);
    setTimeout(() => setCalling(null), 3000);
  };

  const findContact = (name: string) => contacts.find((c) => c.name === name);

  if (calling) {
    return (
      <div className="size-full flex flex-col items-center justify-between py-16 bg-gradient-to-b from-gray-700 to-gray-900 text-white">
        <div className="flex flex-col items-center mt-8">
          <div
            className={`size-28 rounded-full flex-center text-4xl font-semibold ${calling.color} mb-6`}
          >
            {calling.avatar}
          </div>
          <div className="text-2xl font-medium">{calling.name}</div>
          <div className="text-sm text-white/60 mt-1">calling…</div>
        </div>
        <button
          onClick={() => setCalling(null)}
          className="size-16 rounded-full bg-red-500 flex-center hover:bg-red-600 transition-colors"
        >
          <span className="i-material-symbols:call-end text-white text-2xl" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col size-full bg-c-100 text-c-black overflow-hidden">
      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {tab === "recents" && (
          <div>
            <div className="px-5 py-3 text-lg font-semibold text-c-black">Recents</div>
            {recents.map((r) => {
              const c = findContact(r.contact);
              return (
                <div
                  key={r.id}
                  className="hstack space-x-3 px-5 py-2.5 border-b border-black/6 dark:border-white/6"
                >
                  <div
                    className={`size-9 rounded-full flex-center text-white text-xs font-semibold flex-shrink-0 ${c?.color ?? "bg-gray-400"}`}
                  >
                    {c?.avatar ?? "?"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div
                      className={`text-sm font-medium ${r.type === "missed" ? "text-red-500" : "text-c-black"}`}
                    >
                      {r.contact}
                    </div>
                    <div className="hstack space-x-1 text-xs text-c-500">
                      <span className={typeIcon(r.type)} />
                      <span className="capitalize">{r.type}</span>
                    </div>
                  </div>
                  <span className="text-xs text-c-500">{r.time}</span>
                  {c && (
                    <button
                      onClick={() => startCall(c)}
                      className="text-blue-500 text-lg"
                    >
                      <span className="i-material-symbols:call" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {tab === "contacts" && (
          <div>
            <div className="px-5 py-3 text-lg font-semibold text-c-black">Contacts</div>
            {contacts.map((c) => (
              <button
                key={c.id}
                onClick={() => startCall(c)}
                className="w-full hstack space-x-3 px-5 py-2.5 border-b border-black/6 dark:border-white/6 hover:bg-black/4 dark:hover:bg-white/4 transition-colors text-left"
              >
                <div
                  className={`size-9 rounded-full flex-center text-white text-xs font-semibold flex-shrink-0 ${c.color}`}
                >
                  {c.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-c-black">{c.name}</div>
                  <div className="text-xs text-c-500">{c.number}</div>
                </div>
                <span className="i-material-symbols:call text-blue-500 text-lg" />
              </button>
            ))}
          </div>
        )}

        {tab === "keypad" && (
          <div className="flex flex-col items-center pt-6 px-6">
            <div className="h-10 text-2xl font-light text-c-black tracking-wide mb-4">
              {dialed || <span className="text-c-300">Enter number</span>}
            </div>
            <div className="grid grid-cols-3 gap-4">
              {keypadKeys.map((k) => (
                <button
                  key={k.d}
                  onClick={() => setDialed((p) => p + k.d)}
                  className="size-16 rounded-full glass-thin flex flex-col items-center justify-center hover:bg-white/60 dark:hover:bg-white/12 transition-colors"
                >
                  <span className="text-2xl font-light text-c-black leading-none">
                    {k.d}
                  </span>
                  {k.l && (
                    <span className="text-[9px] text-c-500 tracking-widest mt-0.5">
                      {k.l}
                    </span>
                  )}
                </button>
              ))}
            </div>
            <div className="hstack space-x-6 mt-5">
              <button
                onClick={() =>
                  dialed &&
                  startCall({
                    id: "dial",
                    name: dialed,
                    number: dialed,
                    avatar: "#",
                    color: "bg-blue-500"
                  })
                }
                className="size-16 rounded-full bg-green-500 flex-center hover:bg-green-600 transition-colors"
              >
                <span className="i-material-symbols:call text-white text-2xl" />
              </button>
              {dialed && (
                <button
                  onClick={() => setDialed((p) => p.slice(0, -1))}
                  className="size-16 flex-center text-c-500"
                >
                  <span className="i-material-symbols:backspace-outline-rounded text-xl" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Tab bar */}
      <div className="hstack justify-around border-t border-black/8 dark:border-white/8 bg-white/50 dark:bg-gray-900/30 py-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex flex-col items-center px-4 py-1 transition-colors ${
              tab === t.id ? "text-blue-500" : "text-c-500"
            }`}
          >
            <span className={`${t.icon} text-xl`} />
            <span className="text-[10px] mt-0.5">{t.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
