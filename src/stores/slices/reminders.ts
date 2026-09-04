import type { StateCreator } from "zustand";

export interface ReminderItem {
  id: string;
  text: string;
  done: boolean;
  listId: string;
  priority: "none" | "low" | "medium" | "high";
}

export interface ReminderList {
  id: string;
  name: string;
  color: string;
}

export interface RemindersSlice {
  reminderLists: ReminderList[];
  reminders: ReminderItem[];
  addReminderList: (list: ReminderList) => void;
  addReminder: (item: ReminderItem) => void;
  toggleReminder: (id: string) => void;
  deleteReminder: (id: string) => void;
}

export const createRemindersSlice: StateCreator<RemindersSlice> = (set) => ({
  reminderLists: [
    { id: "today", name: "Today", color: "bg-blue-500" },
    { id: "personal", name: "Personal", color: "bg-orange-500" },
    { id: "work", name: "Work", color: "bg-green-500" }
  ],
  reminders: [
    {
      id: "r1",
      text: "Upgrade portfolio to Liquid Glass",
      done: false,
      listId: "work",
      priority: "high"
    },
    {
      id: "r2",
      text: "Review WWDC 2025 session videos",
      done: true,
      listId: "today",
      priority: "none"
    },
    {
      id: "r3",
      text: "Push latest changes to GitHub",
      done: false,
      listId: "work",
      priority: "medium"
    },
    { id: "r4", text: "Buy groceries", done: false, listId: "personal", priority: "low" },
    { id: "r5", text: "Morning run", done: true, listId: "today", priority: "none" }
  ],
  addReminderList: (list) => set((s) => ({ reminderLists: [...s.reminderLists, list] })),
  addReminder: (item) => set((s) => ({ reminders: [...s.reminders, item] })),
  toggleReminder: (id) =>
    set((s) => ({
      reminders: s.reminders.map((r) => (r.id === id ? { ...r, done: !r.done } : r))
    })),
  deleteReminder: (id) =>
    set((s) => ({ reminders: s.reminders.filter((r) => r.id !== id) }))
});
