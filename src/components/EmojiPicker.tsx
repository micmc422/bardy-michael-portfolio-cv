"use client";

import { useState, useCallback, useRef, useEffect, type KeyboardEvent, useId } from "react";

type EmojiItem = {
    char: string;
    description: string;
    aliases?: string[];
    tags?: string[];
};

type EmojiData = Record<string, EmojiItem[]>;

const fallbackEmojiData: EmojiData = {
    smileys: [
        { char: "😀", description: "grinning face" },
        { char: "😃", description: "grinning face with big eyes" },
        { char: "😄", description: "grinning face with smiling eyes" },
        { char: "😁", description: "beaming face with smiling eyes" },
        { char: "😆", description: "grinning squinting face" },
        { char: "😅", description: "grinning face with sweat" },
        { char: "🤣", description: "rolling on the floor laughing" },
        { char: "😂", description: "face with tears of joy" },
    ],
    animals: [
        { char: "🐶", description: "dog face" },
        { char: "🐱", description: "cat face" },
        { char: "🐭", description: "mouse face" },
        { char: "🦊", description: "fox face" },
    ],
    food: [
        { char: "🍎", description: "red apple" },
        { char: "🍐", description: "pear" },
        { char: "🍊", description: "tangerine" },
        { char: "🍋", description: "lemon" },
    ],
    activities: [
        { char: "⚽", description: "soccer ball" },
        { char: "🏀", description: "basketball" },
        { char: "🏈", description: "american football" },
        { char: "⚾", description: "baseball" },
    ],
    travel: [
        { char: "🚗", description: "car" },
        { char: "🚕", description: "taxi" },
        { char: "🚙", description: "sport utility vehicle" },
        { char: "🚌", description: "bus" },
    ],
    objects: [
        { char: "💻", description: "laptop" },
        { char: "📱", description: "mobile phone" },
        { char: "💡", description: "light bulb" },
        { char: "🔍", description: "magnifying glass" },
    ],
    symbols: [
        { char: "❤️", description: "red heart" },
        { char: "💔", description: "broken heart" },
        { char: "💯", description: "hundred points" },
        { char: "✨", description: "sparkles" },
    ],
    flags: [
        { char: "🏁", description: "chequered flag" },
        { char: "🚩", description: "triangular flag" },
        { char: "🎌", description: "crossed flags" },
        { char: "🏴", description: "black flag" },
    ],
};

import generatedEmojiData from '../lib/emoji-data.json';
import type { StyleProps } from "@/once-ui/interfaces";
import type { gridColumns } from "@/once-ui/types";
import { Column, Grid, Icon, IconButton, Input, Scroller, type ButtonOption, type Flex, Text, SegmentedControl, Row } from "@/once-ui/components";
import useDebounce from "@/once-ui/hooks/useDebounce";

const emojiData: EmojiData = Object.keys(generatedEmojiData).length > 0
    ? generatedEmojiData as EmojiData
    : fallbackEmojiData;

export interface EmojiPickerProps extends Omit<React.ComponentProps<typeof Flex>, "onSelect"> {
    onSelect: (emoji: string, tags: string[]) => void;
    onClose?: () => void;
    className?: string;
    background?: StyleProps["background"];
    columns?: gridColumns;
    style?: React.CSSProperties;
}

const EmojiPicker = ({ onSelect, onClose, className, background, columns = "8", style, ...flex }: EmojiPickerProps) => {
    const searchInputId = useId();
    const [inputValue, setInputValue] = useState("");
    const searchQuery = useDebounce(inputValue, 300);
    const [activeCategory, setActiveCategory] = useState("smileys");
    const [focusedEmojiIndex, setFocusedEmojiIndex] = useState<number>(-1);
    const gridRef = useRef<HTMLDivElement>(null);

    const getCategoryIcon = (category: string): string => {
        switch (category) {
            case 'smileys': return 'smiley';
            case 'animals': return 'paw';
            case 'food': return 'food';
            case 'activities': return 'ball';
            case 'travel': return 'world';
            case 'objects': return 'gift';
            case 'symbols': return 'symbol';
            case 'flags': return 'flag';
            default: return 'smiley';
        }
    };

    const categoryButtons: ButtonOption[] = Object.keys(emojiData).map((category) => ({
        value: category,
        children: (
            <Icon name={getCategoryIcon(category)} size="s" />
        ),
    }));

    const handleEmojiSelect = useCallback(
        (emoji: string, tags: string[]) => {
            onSelect(emoji,tags);
            if (onClose) {
                onClose();
            }
        },
        [onSelect, onClose]
    );

    const handleCategoryChange = useCallback((value: string) => {
        setActiveCategory(value);
    }, []);

    const filteredEmojis = searchQuery
        ? Object.values(emojiData)
            .flat()
            .filter((emoji: EmojiItem) => emoji.description.includes(searchQuery.toLowerCase()))
        : emojiData[activeCategory as keyof typeof emojiData] || [];

    // Reset focused index when filtered emojis change
    useEffect(() => {
        setFocusedEmojiIndex(-1);
    }, [filteredEmojis]);

    // Handle keyboard navigation
    const handleKeyDown = useCallback(
        (e: KeyboardEvent<HTMLDivElement>) => {
            if (filteredEmojis.length === 0) return;

            // Use provided columns prop for grid navigation
            const emojisPerRow = Number(columns) || 6;

            let newIndex = focusedEmojiIndex;

            switch (e.key) {
                case 'ArrowRight':
                    e.preventDefault();
                    newIndex = focusedEmojiIndex < filteredEmojis.length - 1 ? focusedEmojiIndex + 1 : 0;
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    newIndex = focusedEmojiIndex > 0 ? focusedEmojiIndex - 1 : filteredEmojis.length - 1;
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    newIndex = focusedEmojiIndex + emojisPerRow;
                    if (newIndex >= filteredEmojis.length) {
                        // Wrap to the beginning of the appropriate column
                        newIndex = focusedEmojiIndex % emojisPerRow;
                        if (newIndex >= filteredEmojis.length) newIndex = filteredEmojis.length - 1;
                    }
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    newIndex = focusedEmojiIndex - emojisPerRow;
                    if (newIndex < 0) {
                        // Wrap to the end of the appropriate column
                        const rowsCount = Math.ceil(filteredEmojis.length / emojisPerRow);
                        newIndex = ((rowsCount - 1) * emojisPerRow) + (focusedEmojiIndex % emojisPerRow);
                        if (newIndex >= filteredEmojis.length) {
                            newIndex = filteredEmojis.length - 1;
                        }
                    }
                    break;
                case 'Enter':
                case ' ':
                    if (focusedEmojiIndex >= 0 && focusedEmojiIndex < filteredEmojis.length) {
                        e.preventDefault();
                        if (filteredEmojis[focusedEmojiIndex]) {
                            handleEmojiSelect(filteredEmojis[focusedEmojiIndex].char, filteredEmojis[focusedEmojiIndex].tags ?? []);
                        }
                    }
                    break;
                default:
                    return;
            }

            setFocusedEmojiIndex(newIndex);
        },
        [filteredEmojis, focusedEmojiIndex, handleEmojiSelect, columns]
    );

    return (
        <Column
            gap="16"
            background={background}
            className={className}
            style={style}
            data-testid="emoji-picker"
            height={24}
            {...flex}
        >
            <Input
                id={`emoji-search-${searchInputId}`}
                value={inputValue}
                height="s"
                onChange={(e) => setInputValue(e.target.value)}
                hasPrefix={<Icon size="s" onBackground="neutral-weak" name="search" />}
                aria-label="Search emojis"
                label={"Rechercher un emojis"}
                onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                }} />

            <Scroller tabIndex={-1} direction="column" fillHeight>
                {filteredEmojis.length > 0 ? (
                    <Grid
                        gap="2"
                        fillWidth
                        columns={columns}
                        aria-label={searchQuery ? "Search results" : `${activeCategory} emojis`}
                        ref={gridRef}
                        onKeyDown={handleKeyDown}
                        tabIndex={-1}
                        role="grid"
                    >
                        {filteredEmojis.map((emoji: EmojiItem, index: number) => {
                            const isFocused = index === focusedEmojiIndex;
                            return (
                                <IconButton
                                    key={index}
                                    tabIndex={(index === 0 || isFocused) ? 0 : -1}
                                    variant="tertiary"
                                    size="l"
                                    onClick={() => handleEmojiSelect(emoji.char, emoji.tags ?? [])}
                                    aria-label={emoji.description}
                                    title={emoji.description}
                                    style={{
                                        transform: isFocused ? 'scale(1.05)' : 'scale(1)',
                                        background: isFocused ? 'var(--neutral-alpha-weak)' : 'transparent',
                                        transition: 'transform 0.1s ease, outline 0.1s ease'
                                    }}
                                    onFocus={() => setFocusedEmojiIndex(index)}
                                    role="gridcell"
                                    ref={isFocused ? (el) => el?.focus() : undefined}
                                >
                                    <Text variant="heading-default-xl">{emoji.char}</Text>
                                </IconButton>
                            );
                        })}
                    </Grid>
                ) : (
                    <Row fill center align="center" onBackground="neutral-weak">
                        No results found
                    </Row>
                )}
            </Scroller>

            {!searchQuery && (
                <SegmentedControl
                    buttons={categoryButtons}
                    onToggle={handleCategoryChange}
                    defaultSelected={activeCategory}
                    fillWidth
                />
            )}
        </Column>
    );
};

EmojiPicker.displayName = "EmojiPicker";

export { EmojiPicker };