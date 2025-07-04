"use client";

import React, { type ReactNode, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Flex, Toast } from ".";
import styles from "./Toaster.module.scss";

interface ToasterProps {
  toasts: {
    id: string;
    variant: "success" | "danger";
    message: ReactNode;
    action?: React.ReactNode;
    keepVisible?: boolean
  }[];
  removeToast: (id: string) => void;
}

const Toaster: React.FC<ToasterProps> = ({ toasts, removeToast }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <Flex
      zIndex={10}
      fillWidth
      direction="column"
      maxWidth={32}
      position="fixed"
      className={styles.toastContainer}
    >
      {toasts.map((toast, index, array) => (
        <Flex
          padding="4"
          fillWidth
          position="absolute"
          key={toast.id}
          className={styles.toastWrapper}
          style={{
            transformOrigin: "bottom center",
            transform: `scale(${1 - (array.length - 1 - index) * 0.05}) translateY(${1 - (array.length - 1 - index) * 10}%)`,
            opacity: array.length - 1 - index === 0 ? 1 : 0.9,
          }}
        >
          <Toast
            className={styles.toastAnimation}
            variant={toast.variant}
            onClose={() => removeToast(toast.id)}
            action={toast.action}
            keepVisible={toast.keepVisible}
          >
            {toast.message}
          </Toast>
        </Flex>
      ))}
    </Flex>,
    document.body,
  );
};

Toaster.displayName = "Toaster";
export { Toaster };
