"use client";

import { toast as sonnerToast } from "sonner";

type ToastProps = {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
};

export const useToast = () => {
  const toast = ({ title, description, variant }: ToastProps) => {
    if (variant === "destructive") {
      return sonnerToast.error(title, {
        description,
      });
    }

    return sonnerToast(title, {
      description,
    });
  };

  return { toast };
}; 