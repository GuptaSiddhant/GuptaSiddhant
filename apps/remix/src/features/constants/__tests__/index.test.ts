import { describe, expect, test } from "vitest";

import {
  DEFAULT_LOCALE,
  ONE_DAY_IN_S,
  ONE_DAY_IN_MS,
  ONE_HOUR_IN_MS,
  ONE_MIN_IN_MS,
} from "..";

test("default locale", () => {
  expect(DEFAULT_LOCALE).toBe("en-GB");
});

describe.concurrent("Durations", () => {
  test("ONE_DAY_IN_S", () => {
    expect(ONE_DAY_IN_S).toBe(86_400);
  });
  test("ONE_DAY_IN_MS", () => {
    expect(ONE_DAY_IN_MS).toBe(86_400_000);
  });
  test("ONE_HOUR_IN_MS", () => {
    expect(ONE_HOUR_IN_MS).toBe(3_600_000);
  });
  test("ONE_MIN_IN_MS", () => {
    expect(ONE_MIN_IN_MS).toBe(60_000);
  });
});
