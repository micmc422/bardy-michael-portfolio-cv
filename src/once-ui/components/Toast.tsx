"use client";

import React, { useEffect, useState, forwardRef } from "react";
import { IconButton, Icon, Flex, Text } from ".";
import classNames from "classnames";
import styles from "./Toast.module.scss";
import type { IconName } from "../icons";

interface ToastProps {
  className?: string;
  variant: "success" | "danger";
  icon?: boolean;
  onClose?: () => void;
  action?: React.ReactNode;
  children: React.ReactNode;
  keepVisible?: boolean
}

const iconMap: { [key in ToastProps["variant"]]: IconName } = {
  success: "checkCircle",
  danger: "errorCircle",
};

const Toast = forwardRef<HTMLDivElement, ToastProps>(
  ({ variant, className, icon = true, onClose, action, children, keepVisible }, ref) => {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
      if (!keepVisible) {
        const timer = setTimeout(() => setVisible(false), 6000);
        return () => clearTimeout(timer);
      }
    }, []);

    useEffect(() => {
      if (!visible && onClose) {
        onClose();
      }
    }, [visible, onClose]);

    return (
      <Flex
        ref={ref}
        fillWidth
        background="surface"
        radius="l"
        paddingY="12"
        paddingX="20"
        border="neutral-medium"
        role="alert"
        aria-live="assertive"
        className={classNames(className, styles.toast, styles[variant], {
          [styles.visible as string]: visible,
          [styles.hidden as string]: !visible,
        })}
      >
        <Flex fillWidth vertical="center" gap="8">
          {icon && !keepVisible && (
            <Icon
              size="s"
              onBackground={`${variant}-medium`}
              name={iconMap[variant]}
            />
          )}
          <Text variant="body-default-s" style={{ width: "100%" }} as="div">
            {children}
          </Text>
          {action && <div>{action}</div>}
          {onClose && !keepVisible && (
            <IconButton
              variant="ghost"
              icon="close"
              size="m"
              tooltip="Hide"
              tooltipPosition="top"
              onClick={() => setVisible(false)}
            />
          )}
        </Flex>
      </Flex>
    );
  }
);

Toast.displayName = "Toast";

export { Toast };
