"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

const useUserStore = create(
  persist(
    (set) => ({
      userName: "",
      displayName: "",
      email: "",
      avatar: "",
      setData: (data) => set(() => ({ ...data })),
      clearData: () =>
        set({ userName: "", displayName: "", email: "", avatar: "" }),
    }),
    {
      name: "user-store",
    }
  )
);

export default useUserStore;
