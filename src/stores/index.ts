import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createDockSlice, type DockSlice } from "./slices/dock";
import { createSystemSlice, type SystemSlice } from "./slices/system";
import { createUserSlice, type UserSlice } from "./slices/user";
import { createRemindersSlice, type RemindersSlice } from "./slices/reminders";

export const useStore = create<DockSlice & SystemSlice & UserSlice & RemindersSlice>()(
  persist(
    (...a) => ({
      ...createDockSlice(...a),
      ...createSystemSlice(...a),
      ...createUserSlice(...a),
      ...createRemindersSlice(...a)
    }),
    {
      name: "macos-store",
      partialize: (state) => ({
        dockSize: state.dockSize,
        dockMag: state.dockMag,
        dark: state.dark,
        volume: state.volume,
        brightness: state.brightness,
        wifi: state.wifi,
        bluetooth: state.bluetooth,
        airdrop: state.airdrop,
        faceTimeImages: state.faceTimeImages,
        reminderLists: state.reminderLists,
        reminders: state.reminders
      })
    }
  )
);
