import { describe, expect, test } from "vitest";

import isEqual from "../is-equal";

describe.concurrent("isEqual", () => {
  test("return true for similar arrays", () => {
    const first = [0, 1, 2];
    const second = first.slice();

    expect(isEqual(first, second)).toBe(true);
  });

  test("return false for a single falsy input", () => {
    expect(isEqual([], undefined)).toBe(false);
    expect(isEqual(null, [])).toBe(false);
  });

  test("return false for different types of inputs", () => {
    expect(isEqual([], {})).toBe(false);
  });

  test("return false for different arrays", () => {
    const first = [0, 1, 2, 3];
    const second = first.slice(1);

    expect(isEqual(first, second)).toBe(false);
  });

  test("return false for different arrays items", () => {
    const first = [0, 1, 2, 3];
    const second = [2, 3, 4, 5];

    expect(isEqual(first, second)).toBe(false);
  });

  test("return true for similar objects", () => {
    const first = { a: "b", c: "d" };
    const second = { ...first };

    expect(isEqual(first, second)).toBe(true);
  });

  test("return false for different objects", () => {
    const first = { a: "b", c: "d" };
    const second = { ...first, e: "f" };

    expect(isEqual(first, second)).toBe(false);
    expect(isEqual({ a: 0 }, { a: 1 })).toBe(false);
  });

  test("return true for nested similar objects", () => {
    const first = { a: "b", c: "d", e: [0, 1, 2] };
    const second = { a: "b", c: "d", e: [0, 1, 2] };

    expect(isEqual(first, second)).toBe(true);
  });

  test("return false for nested different objects", () => {
    const first = { a: "b", c: "d", e: [0, 1, 2] };
    const second = { a: "b", c: "d", e: [0, 1] };

    expect(isEqual(first, second)).toBe(false);

    expect(isEqual({ a: "b" }, { b: "b" })).toBe(false);
  });

  test("return true for similar scalers", () => {
    const first = 10;
    const second = 10;

    expect(isEqual(first, second)).toBe(true);
  });

  test("return true for different scalers", () => {
    const first = 10;
    const second = 11;

    expect(isEqual(first, second)).toBe(false);
  });
});
