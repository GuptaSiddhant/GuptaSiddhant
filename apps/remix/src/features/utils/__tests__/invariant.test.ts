import { describe, expect, test } from "vitest";

import invariant from "../invariant";

describe.concurrent("invariant", () => {
  const x: number = 2;

  test("should throw on falsy statement", () => {
    expect(() => invariant(x === 3, "x should be 2")).toThrowError(
      "Invariant failed: x should be 2",
    );
  });

  test("should throw on falsy statement without message", () => {
    expect(() => invariant(x === 3)).toThrowError("Invariant failed");
  });

  test("should not throw on truthy statement", () => {
    expect(invariant(x === 2, "x should be 2")).toBeUndefined();
  });
});
