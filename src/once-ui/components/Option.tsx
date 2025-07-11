import classNames from "classnames";
import { Flex, Text } from ".";
import styles from "./Option.module.scss";
import { ElementType } from "./ElementType";
import React, { forwardRef } from "react";

export interface OptionProps {
  label: React.ReactNode;
  href?: string;
  value: string;
  hasPrefix?: React.ReactNode;
  hasSuffix?: React.ReactNode;
  description?: React.ReactNode;
  danger?: boolean;
  selected?: boolean;
  highlighted?: boolean;
  tabIndex?: number;
  onClick?: (value: string) => void;
  onLinkClick?: () => void;
}

const Option = forwardRef<HTMLDivElement, OptionProps>(
  (
    {
      label,
      value,
      href,
      hasPrefix,
      hasSuffix,
      description,
      danger,
      selected,
      highlighted,
      tabIndex,
      onClick,
      onLinkClick,
      ...props
    },
    ref,
  ) => {
    if (href && onClick) {
      console.warn("Option should not have both `href` and `onClick` props.");
    }

    return (
      <ElementType
        tabIndex={tabIndex}
        ref={ref}
        href={href}
        className="reset-button-styles fill-width"
        onLinkClick={onLinkClick}
      >
        <Flex
          {...props}
          fillWidth
          vertical="center"
          paddingX="12"
          paddingY="8"
          gap="12"
          radius="m"
          role="option"
          aria-selected={selected}
          tabIndex={-1}
          borderWidth={1}
          borderStyle="solid"
          cursor="interactive"
          transition="micro-medium"
          onClick={() => onClick?.(value)}
          className={classNames(styles.option, {
            [styles.danger as string]: danger,
            [styles.selected as string]: selected,
            [styles.highlighted as string]: highlighted,
          })}
          data-value={value}
        >
          {hasPrefix && <Flex className={styles.prefix}>{hasPrefix}</Flex>}
          <Flex
            horizontal="start"
            style={{
              whiteSpace: "nowrap",
            }}
            maxWidth={20}
            direction="column"
          >
            <Text onBackground="neutral-strong" variant="label-default-s">
              {label}
            </Text>
            {description && (
              <Text variant="body-default-xs" align="left" onBackground="neutral-weak" wrap="balance" >
              {description}
              </Text>
            )}
          </Flex>
          {hasSuffix && <Flex className={styles.suffix}>{hasSuffix}</Flex>}
        </Flex>
      </ElementType>
    );
  },
);

Option.displayName = "Option";
export { Option };
