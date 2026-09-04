import React, { useState } from "react";
import { useStore } from "~/stores";

const priorityColors: Record<string, string> = {
  high: "text-red-500",
  medium: "text-orange-500",
  low: "text-yellow-500",
  none: "text-transparent"
};

export default function Reminders() {
  const lists = useStore((s) => s.reminderLists);
  const reminders = useStore((s) => s.reminders);
  const addReminder = useStore((s) => s.addReminder);
  const toggleReminder = useStore((s) => s.toggleReminder);
  const deleteReminder = useStore((s) => s.deleteReminder);

  const [activeList, setActiveList] = useState("today");
  const [newText, setNewText] = useState("");

  const listReminders = reminders.filter((r) => r.listId === activeList);
  const activeListData = lists.find((l) => l.id === activeList);

  const add = () => {
    if (!newText.trim()) return;
    addReminder({
      id: Date.now().toString(),
      text: newText.trim(),
      done: false,
      listId: activeList,
      priority: "none"
    });
    setNewText("");
  };

  const countFor = (id: string) =>
    reminders.filter((r) => r.listId === id && !r.done).length;

  return (
    <div className="flex size-full bg-c-100 text-c-black overflow-hidden">
      {/* Sidebar */}
      <div className="w-52 flex-shrink-0 border-r border-black/8 dark:border-white/8 bg-white/50 dark:bg-gray-900/30 py-3">
        <p className="px-4 text-xs font-semibold text-c-400 uppercase tracking-wide mb-2">
          My Lists
        </p>
        {lists.map((l) => (
          <button
            key={l.id}
            onClick={() => setActiveList(l.id)}
            className={`w-full hstack space-x-3 px-4 py-2 text-sm transition-colors ${
              activeList === l.id
                ? "bg-black/6 dark:bg-white/8 rounded-lg mx-2 w-[calc(100%-1rem)]"
                : "hover:bg-black/4 dark:hover:bg-white/4"
            }`}
          >
            <span className={`size-5 rounded-full flex-center ${l.color}`}>
              <span className="i-material-symbols:format-list-bulleted text-white text-[11px]" />
            </span>
            <span className="flex-1 text-left text-c-black">{l.name}</span>
            <span className="text-xs text-c-500">{countFor(l.id)}</span>
          </button>
        ))}
      </div>

      {/* Reminders list */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="px-6 pt-5 pb-3">
          <h1
            className={`text-2xl font-bold ${activeListData?.color.replace("bg-", "text-")}`}
          >
            {activeListData?.name}
          </h1>
        </div>

        <div className="flex-1 overflow-y-auto px-6">
          {listReminders.length === 0 && (
            <div className="text-c-400 text-sm mt-8 text-center">No Reminders</div>
          )}
          {listReminders.map((r) => (
            <div
              key={r.id}
              className="group hstack space-x-3 py-2.5 border-b border-black/6 dark:border-white/6"
            >
              <button
                onClick={() => toggleReminder(r.id)}
                className={`size-5 rounded-full border-2 flex-center flex-shrink-0 transition-colors ${
                  r.done ? "bg-blue-500 border-blue-500" : "border-c-300"
                }`}
              >
                {r.done && (
                  <span className="i-material-symbols:check text-white text-xs" />
                )}
              </button>
              {r.priority !== "none" && (
                <span className={`text-xs font-bold ${priorityColors[r.priority]}`}>
                  {r.priority === "high" ? "!!!" : r.priority === "medium" ? "!!" : "!"}
                </span>
              )}
              <span
                className={`flex-1 text-sm ${r.done ? "text-c-400 line-through" : "text-c-black"}`}
              >
                {r.text}
              </span>
              <button
                onClick={() => deleteReminder(r.id)}
                className="opacity-0 group-hover:opacity-100 text-c-400 hover:text-red-500 transition-all"
              >
                <span className="i-material-symbols:delete-outline-rounded text-base" />
              </button>
            </div>
          ))}

          {/* Add new */}
          <div className="hstack space-x-3 py-2.5">
            <span className="size-5 rounded-full border-2 border-c-200 flex-shrink-0" />
            <input
              className="flex-1 bg-transparent text-sm no-outline text-c-black placeholder:text-c-400"
              placeholder="New Reminder"
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && add()}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
