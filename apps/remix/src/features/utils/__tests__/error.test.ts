import {
  getErrorMessage,
  isErrorWithMessage,
  toErrorWithMessage,
} from "../error";
import { describe, expect, test } from "vitest";

describe.concurrent("isErrorWithMessage", () => {
  test("return false if not a valid error with message", () => {
    expect(isErrorWithMessage({})).toBe(false);
    expect(isErrorWithMessage({ message: false })).toBe(false);
    expect(isErrorWithMessage("error")).toBe(false);
    expect(isErrorWithMessage(undefined)).toBe(false);
    expect(isErrorWithMessage(null)).toBe(false);
  });

  test("return true if a valid error with message", () => {
    expect(isErrorWithMessage({ message: "" })).toBe(true);
    expect(isErrorWithMessage(new Error())).toBe(true);
  });
});

describe.concurrent("toErrorWithMessage", () => {
  test("return a valid error if input contains message", () => {
    const error = new Error();
    expect(toErrorWithMessage(error)).toBe(error);
    expect(toErrorWithMessage({ message: "" })).toEqual({ message: "" });
  });

  test("return new error if not a valid error with message", () => {
    expect(toErrorWithMessage({})).toEqual(new Error("{}"));
    expect(toErrorWithMessage(false)).toEqual(new Error("false"));
    expect(toErrorWithMessage("{key:value}")).toEqual(
      new Error('"{key:value}"'),
    );

    const obj: Record<string, unknown> = { val: "0", ref: undefined };
    obj.ref = obj; // cyclical reference to break JSON.stringify
    expect(toErrorWithMessage(obj)).toEqual(new Error("[object Object]"));
  });
});

describe.concurrent("getErrorMessage", () => {
  test("return error message from any input", () => {
    expect(getErrorMessage(new Error("test"))).toBe("test");
    expect(getErrorMessage({ message: "test" })).toBe("test");
    expect(getErrorMessage({ message: 0 })).toBe('{"message":0}');
  });
});
