// https://github.com/vadimdemedes/ink-select-input

import { useState, useEffect, useRef, useCallback } from "react";
import { Box, useInput } from "ink";
import type { FC } from "react";

// eslint-disable-next-line react/function-component-definition
export default function SelectInput<T>({
  items = [],
  isFocused = true,
  initialIndex = 0,
  IndicatorComponent,
  ItemComponent,
  limit: customLimit,
  onSelect,
  onHighlight,
}: SelectProps<T>): JSX.Element {
  const [rotateIndex, setRotateIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(initialIndex);
  const hasLimit =
    typeof customLimit === "number" && items.length > customLimit;
  const limit = hasLimit ? Math.min(customLimit!, items.length) : items.length;

  const previousItems = useRef<Array<Item<T>>>(items);

  useEffect(() => {
    const previousKeys = previousItems.current.map((item) => item.key);
    const currentKeys = items.map((item) => item.key);

    if (!isEqualArray(previousKeys, currentKeys)) {
      setRotateIndex(0);
      setSelectedIndex(0);
    }

    previousItems.current = items;
  }, [items]);

  useInput(
    useCallback(
      (input, key) => {
        if (input === "k" || key.upArrow) {
          const lastIndex = (hasLimit ? limit : items.length) - 1;
          const atFirstIndex = selectedIndex === 0;
          const nextIndex = hasLimit ? selectedIndex : lastIndex;
          const nextRotateIndex = atFirstIndex ? rotateIndex + 1 : rotateIndex;
          const nextSelectedIndex = atFirstIndex
            ? nextIndex
            : selectedIndex - 1;

          setRotateIndex(nextRotateIndex);
          setSelectedIndex(nextSelectedIndex);

          const slicedItems = hasLimit
            ? arrayRotate(items, nextRotateIndex).slice(0, limit)
            : items;

          if (typeof onHighlight === "function") {
            onHighlight(slicedItems[nextSelectedIndex]);
          }
        }

        if (input === "j" || key.downArrow) {
          const atLastIndex =
            selectedIndex === (hasLimit ? limit : items.length) - 1;
          const nextIndex = hasLimit ? selectedIndex : 0;
          const nextRotateIndex = atLastIndex ? rotateIndex - 1 : rotateIndex;
          const nextSelectedIndex = atLastIndex ? nextIndex : selectedIndex + 1;

          setRotateIndex(nextRotateIndex);
          setSelectedIndex(nextSelectedIndex);

          const slicedItems = hasLimit
            ? arrayRotate(items, nextRotateIndex).slice(0, limit)
            : items;

          if (typeof onHighlight === "function") {
            onHighlight(slicedItems[nextSelectedIndex]);
          }
        }

        if (key.return) {
          const slicedItems = hasLimit
            ? arrayRotate(items, rotateIndex).slice(0, limit)
            : items;

          if (typeof onSelect === "function") {
            onSelect(slicedItems[selectedIndex]);
          }
        }
      },
      [
        hasLimit,
        limit,
        rotateIndex,
        selectedIndex,
        items,
        onSelect,
        onHighlight,
      ]
    ),
    { isActive: isFocused }
  );

  const slicedItems = hasLimit
    ? arrayRotate(items, rotateIndex).slice(0, limit)
    : items;

  return (
    <Box flexDirection="column">
      {slicedItems.map((item, index) => {
        const isSelected = index === selectedIndex;

        return (
          <Box key={item.key}>
            <IndicatorComponent selected={isSelected} />
            <ItemComponent {...item} selected={isSelected} />
          </Box>
        );
      })}
    </Box>
  );
}

// https://github.com/kevva/arr-rotate/
function arrayRotate<T>(input: Item<T>[], n: number) {
  if (!Array.isArray(input)) {
    throw new TypeError(`Expected an array, got ${typeof input}`);
  }

  const x = input.slice();
  const num = typeof n === "number" ? n : 0;

  return x.splice(-num % x.length).concat(x);
}

// https://stackoverflow.com/a/19746771
function isEqualArray(a: string[], b: string[]): boolean {
  const array2Sorted = b.slice().sort();
  return (
    a.length === b.length &&
    a
      .slice()
      .sort()
      .every((value, index) => value === array2Sorted[index])
  );
}

export interface IndicatorProps {
  selected?: boolean;
}

export interface ItemProps<T> {
  selected: boolean;
  item: T;
  key: string;
}

export interface Item<T> {
  key: string;
  item: T;
}

export interface SelectProps<T> {
  /**
   * Items to display in a list. Each item must be an object and have `label` and `value` props, it may also optionally have a `key` prop.
   * If no `key` prop is provided, `value` will be used as the item key.
   */
  items: Array<Item<T>>;

  /**
   * Listen to user's input. Useful in case there are multiple input components at the same time and input must be "routed" to a specific component.
   *
   * @default true
   */
  isFocused?: boolean;

  /**
   * Index of initially-selected item in `items` array.
   *
   * @default 0
   */
  initialIndex?: number;

  /**
   * Number of items to display.
   */
  limit?: number;

  /**
   * Custom component to override the default indicator component.
   */
  IndicatorComponent: FC<IndicatorProps>;

  /**
   * Custom component to override the default item component.
   */
  ItemComponent: FC<ItemProps<T>>;

  /**
   * Function to call when user selects an item. Item object is passed to that function as an argument.
   */
  onSelect?: (item: Item<T>) => void;

  /**
   * Function to call when user highlights an item. Item object is passed to that function as an argument.
   */
  onHighlight?: (item: Item<T>) => void;
}
