"use client";

// TYPES
import { CustomToast, PartialCustomToast } from "@/lib/toast";

// LIBRARIES
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

// CONFIG
import { init_toast_function } from "@/lib/toast";

// COMPONENTS
import {
  ToastProvider as Provider,
  ToastViewport as Viewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
} from "@/components/ui/Toast";

export function ToastProvider({ children }: { children: React.ReactNode }) {
  /*------- STATE -------*/
  const [toasts, set_toasts] = useState<CustomToast[]>([]);

  /*------- METHODS -------*/
  const add_toast = (toast: PartialCustomToast) =>
    set_toasts((prev) => [
      ...prev,
      {
        ...toast,
        id: uuidv4(),
      } as CustomToast,
    ]);

  const dismiss_toast = (id: string) => {
    set_toasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  /*------- HOOKS -------*/
  useEffect(() => {
    init_toast_function(add_toast);
  }, []);

  /*------- RENDERER -------*/
  return (
    <Provider>
      {children}

      {/* TOASTER */}
      {toasts.map(({ id, title, description, action, ...props }) => (
        <Toast
          key={id}
          {...props}
          onOpenChange={() => dismiss_toast(id)}
          duration={props.duration || 3000}
        >
          <div className="grid gap-1">
            {title && <ToastTitle>{title}</ToastTitle>}
            {description && <ToastDescription>{description}</ToastDescription>}
          </div>
          {action}
          <ToastClose />
        </Toast>
      ))}
      <Viewport />
    </Provider>
  );
}
