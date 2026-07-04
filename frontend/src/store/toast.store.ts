import { create } from "zustand";

type ToastState = {
  queue: string[];
  show: (message: string) => void;
  shift: () => void;
};

export const useToastStore = create<ToastState>((set) => ({
  queue: [],
  show: (message) => set((state) => ({ queue: [...state.queue, message] })),
  shift: () => set((state) => ({ queue: state.queue.slice(1) })),
}));
