// LIBRARIES
import { ToastActionElement, ToastProps } from "@/components/ui/Toast";

// TYPES
export type CustomToast = ToastProps & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
};
export type PartialCustomToast = Omit<CustomToast, "id">;
type ToastFunction = (toast: PartialCustomToast) => void;

// VARIABLES
let toast_fn: ToastFunction;

export const init_toast_function = (fn: ToastFunction) => {
  toast_fn = fn;
};

export const toast: ToastFunction = (payload) => {
  if (toast_fn) {
    toast_fn(payload);
  } else {
    console.warn("Toast system not ready yet.");
  }
};
