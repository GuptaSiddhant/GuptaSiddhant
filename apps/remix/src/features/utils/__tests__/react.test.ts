import { describe, expect, test } from "vitest";

import { mergeRefs } from "../react";

describe("mergeRefs", () => {
  test("works", () => {
    // Object refs
    const ref1 = { current: "x" };
    const ref2 = { current: "y" };
    // Function ref
    let ref3CurrentValue: string = "z";
    const ref3 = (value: string) => {
      ref3CurrentValue = value;
    };
    // Falsy refs
    const ref4 = null;
    const ref5 = undefined;

    const mergedRef = mergeRefs(ref1, ref2, ref3, ref4, ref5);

    mergedRef("0"); // change ref's value
    expect(ref1.current).toBe("0");
    expect(ref2.current).toBe("0");
    expect(ref3CurrentValue).toBe("0");
  });
});
