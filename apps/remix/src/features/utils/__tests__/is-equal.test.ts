import { describe, expect, test } from "vitest";

import isEqual from "../is-equal";

describe.concurrent("isEqual", () => {
  test("return true for similar arrays", () => {
    const first = [0, 1, 2];
    const second = first.slice();

    expect(isEqual(first, second)).toBe(true);
  });

  test("return false for different arrays", () => {
    const first = [0, 1, 2, 3];
    const second = first.slice(1);

    expect(isEqual(first, second)).toBe(false);
  });

  test("return true for similar objects", () => {
    const first = { a: "b", c: "d" };
    const second = { ...first };

    expect(isEqual(first, second)).toBe(true);
  });

  test("return true for different objects", () => {
    const first = { a: "b", c: "d" };
    const second = { ...first, e: "f" };

    expect(isEqual(first, second)).toBe(false);
  });

  test("return true for similar primitives", () => {
    const first = 10;
    const second = 10;

    expect(isEqual(first, second)).toBe(true);
  });

  test("return true for different primitives", () => {
    const first = 10;
    const second = 11;

    expect(isEqual(first, second)).toBe(false);
  });

  test("return true for nested similar objects", () => {
    const first = { a: "b", c: "d", e: [0, 1, 2] };
    const second = { a: "b", c: "d", e: [0, 1, 2] };

    expect(isEqual(first, second)).toBe(true);
  });
});
