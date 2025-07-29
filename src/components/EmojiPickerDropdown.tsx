"use client";

import { DropdownWrapper, type gridColumns, type StyleProps } from "@once-ui-system/core";
import React from "react";
import { EmojiPicker } from "./EmojiPicker";
export interface EmojiPickerDropdownProps extends Omit<React.ComponentProps<typeof DropdownWrapper>, 'dropdown' | 'onSelect'> {
    onSelect: (data: { emoji: string, tags: string[] }) => void;
    background?: StyleProps["background"];
    columns?: gridColumns;
}

const EmojiPickerDropdown: React.FC<EmojiPickerDropdownProps> = ({
    trigger,
    onSelect,
    closeAfterClick = false,
    background = "surface",
    columns = "8",
    ...dropdownProps
}) => {
    const handleEmojiSelect = (emoji: string, tags: string[]) => {
        onSelect({ emoji, tags });
        if (closeAfterClick) {
            dropdownProps.onOpenChange?.(false);
        }
    };

    return (
        <DropdownWrapper
            {...dropdownProps}
            trigger={trigger}
            dropdown={
                <EmojiPicker
                    columns={columns}
                    padding="8"
                    onSelect={handleEmojiSelect}
                    onClose={closeAfterClick ? () => dropdownProps.onOpenChange?.(false) : undefined}
                    background={background}
                />
            }
        />
    );
};

export { EmojiPickerDropdown };