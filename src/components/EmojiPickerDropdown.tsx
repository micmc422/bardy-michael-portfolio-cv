"use client";

import { DropdownWrapper } from "@/once-ui/components";
import type { StyleProps } from "@/once-ui/interfaces";
import type { gridColumns } from "@/once-ui/types";
import React from "react";
import { EmojiPicker } from "./EmojiPicker";

export interface EmojiPickerDropdownProps extends Omit<React.ComponentProps<typeof DropdownWrapper>, 'dropdown'> {
    onSelect: (emoji: string) => void;
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
    const handleEmojiSelect = (emoji: string) => {
        onSelect(emoji);
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