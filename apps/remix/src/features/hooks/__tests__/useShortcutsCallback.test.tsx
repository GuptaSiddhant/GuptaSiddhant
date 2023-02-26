/** @vitest-environment jsdom */

import { renderHook } from "@testing-library/react";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, test, vi } from "vitest";

import type { NavigationLinkProps } from "@gs/types";

import useShortcutsCallback, {
  ShortcutModifier,
  generateKeyDownArray,
  matchKeyDownArrays,
} from "../useShortcutsCallback";

describe.concurrent("generateKeyDownArray", () => {
  test("Only Key", () => {
    const event = newKeyDownEvent({ key: "k" });

    expect(generateKeyDownArray(event)).toEqual(["K"]);
  });

  test("Key with single modifier", () => {
    const event = newKeyDownEvent({ key: "k", metaKey: true });

    expect(generateKeyDownArray(event)).toEqual(["K", ShortcutModifier.META]);
  });

  test("Key with multiple modifier", () => {
    const event = newKeyDownEvent({
      key: "k",
      metaKey: true,
      shiftKey: true,
    });

    expect(generateKeyDownArray(event)).toEqual([
      "K",
      ShortcutModifier.META,
      ShortcutModifier.SHIFT,
    ]);
  });
});

describe.concurrent("matchKeyDownArrays", () => {
  test("Empty/missing arrays should return false", () => {
    expect(matchKeyDownArrays([], [])).toBe(false);
    expect(matchKeyDownArrays(undefined, [])).toBe(false);
    expect(matchKeyDownArrays([], undefined)).toBe(false);
  });

  test("Arrays with different length should return false", () => {
    expect(matchKeyDownArrays([], ["s"])).toBe(false);
    expect(matchKeyDownArrays(["s", "B"], ["s"])).toBe(false);
  });

  test("Non-matching arrays return false", () => {
    const event = newKeyDownEvent({ key: "k", metaKey: true, shiftKey: true });
    const resultArray = generateKeyDownArray(event);
    const expectedArray: string[] = [ShortcutModifier.META, "k"];

    expect(matchKeyDownArrays(resultArray, expectedArray)).toBe(false);
  });
  test("Non-matching arrays (2) return false", () => {
    const event = newKeyDownEvent({ key: "k", metaKey: true });
    const resultArray = generateKeyDownArray(event);
    const expectedArray: string[] = [
      ShortcutModifier.META,
      ShortcutModifier.SHIFT,
      "k",
    ];

    expect(matchKeyDownArrays(resultArray, expectedArray)).toBe(false);
  });

  test("Matching arrays return true", () => {
    const event = newKeyDownEvent({ key: "k", metaKey: true, shiftKey: true });
    const resultArray = generateKeyDownArray(event);
    const expectedArray: string[] = [
      ShortcutModifier.META,
      ShortcutModifier.SHIFT,
      "k",
    ];

    expect(matchKeyDownArrays(resultArray, expectedArray)).toBe(true);
  });
});

describe("useShortcutsCallback", () => {
  test("Shortcut callback is defined", () => {
    const mockLogger = vi.fn();
    const callback = generateCallbackFromUseShortcutsCallback(mockLogger);

    expect(callback).toBeDefined();
  });

  test("perform matching actions", () => {
    const mockLogger = vi.fn();
    const callback = generateCallbackFromUseShortcutsCallback(mockLogger);

    callback(newKeyDownEvent({ key: "k", metaKey: true }));
    expect(mockLogger).toHaveBeenCalledWith("search");

    callback(newKeyDownEvent({ key: "k", metaKey: true, shiftKey: true }));
    expect(mockLogger).toHaveBeenCalledWith("cmd");

    // Should not invoke any action if no match
    callback(
      newKeyDownEvent({
        key: "k",
        metaKey: true,
        shiftKey: true,
        ctrlKey: true,
      }),
    );

    expect(mockLogger).toHaveBeenCalledTimes(2);
  });
});

// Helpers
function newKeyDownEvent(eventInitDict: KeyboardEventInit) {
  return new KeyboardEvent("keydown", eventInitDict);
}

function generateCallbackFromUseShortcutsCallback(
  mockLogger: (...args: unknown[]) => void,
  wrapper = Wrapper,
) {
  const shortcuts: Array<Partial<NavigationLinkProps>> = [
    {
      shortcut: [ShortcutModifier.META, ShortcutModifier.SHIFT, "k"],
      onClick: () => mockLogger("cmd"),
    },
    {
      shortcut: [ShortcutModifier.META, "k"],
      onClick: () => mockLogger("search"),
    },
  ];

  const {
    result: { current },
  } = renderHook(() => useShortcutsCallback(shortcuts), {
    wrapper,
  });

  return current;
}

function Wrapper({ children }: { children: React.ReactNode }) {
  return <MemoryRouter>{children}</MemoryRouter>;
}
