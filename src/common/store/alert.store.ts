import { create } from "zustand";

export type AlertType = "success" | "error" | "warning";

interface AlertState {
  isVisible: boolean;
  message: string;
  type: AlertType;
  show: (message: string, type?: AlertType) => void;
  hide: () => void;
}

export const useAlertStore = create<AlertState>((set) => ({
  isVisible: false,
  message: "",
  type: "success",
  show: (message: string, type: AlertType = "success") =>
    set({ isVisible: true, message, type }),
  hide: () => set({ isVisible: false, message: "" }),
}));
