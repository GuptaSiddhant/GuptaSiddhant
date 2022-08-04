import { describe, expect, test } from "vitest"

import { DEFAULT_LOCALE, ONE_DAY_IN_S } from "."

describe("Constants", () => {
  test("default locale", () => {
    expect(DEFAULT_LOCALE).toBe("en-GB")
  })

  describe("Durations", () => {
    test("ONE_DAY_IN_S", () => {
      expect(ONE_DAY_IN_S).toBe(86400)
    })
  })
})
