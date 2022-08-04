import { describe, expect, test } from "vitest"

import { ONE_DAY_IN_MS, ONE_HOUR_IN_MS, ONE_MIN_IN_MS } from "@gs/constants"

import {
  capitalize,
  cleanupText,
  formatDate,
  formatDateTime,
  formatList,
  formatTime,
  formatUnit,
  formatYYYYMMDD,
  toKebabCase,
  transformMsToReadableString,
} from "./format"

describe("Formatting date-time", () => {
  const date = new Date(2020, 3, 10, 10, 25, 30)

  test("formatDate", () => {
    expect(formatDate(date)).toMatchInlineSnapshot('"10 April 2020"')
  })

  test("formatDateTime", () => {
    expect(formatDateTime(date)).toMatchInlineSnapshot('"10/04/2020, 10:25:30"')
  })

  test("formatYYYYMMDD", () => {
    expect(formatYYYYMMDD(date)).toMatchInlineSnapshot('"2020-04-10"')
  })

  test("formatYYYYMMDD - undefined", () => {
    expect(formatYYYYMMDD()).toBeUndefined()
  })

  test("formatTime", () => {
    expect(formatTime(date)).toBe("10:25:30")
  })
})

describe("Formatting units", () => {
  test("formatUnit - byte=1", () => {
    expect(formatUnit(1, "byte")).toMatchInlineSnapshot('"1 byte"')
  })
  test("formatUnit - byte=2345.67", () => {
    expect(formatUnit(2345.67, "byte")).toMatchInlineSnapshot(
      '"2,345.67 bytes"',
    )
  })

  test("formatUnit - gram=1", () => {
    expect(formatUnit(1, "gram")).toMatchInlineSnapshot('"1 gram"')
  })
  test("formatUnit - gram=2345.67", () => {
    expect(formatUnit(2345.67, "gram")).toMatchInlineSnapshot(
      '"2,345.67 grams"',
    )
  })
})

describe("Formatting list", () => {
  const list = ["a", "b", "c"]

  test("formatList - string", () => {
    expect(formatList(list, false)).toMatchInlineSnapshot('"a, b and c"')
  })

  test("formatList - parts", () => {
    expect(formatList(list, true)).toMatchInlineSnapshot(`
      [
        {
          "type": "element",
          "value": "a",
        },
        {
          "type": "literal",
          "value": ", ",
        },
        {
          "type": "element",
          "value": "b",
        },
        {
          "type": "literal",
          "value": " and ",
        },
        {
          "type": "element",
          "value": "c",
        },
      ]
    `)
  })
})

describe("Formatting string", () => {
  test("Duration is readable string", () => {
    const duration =
      ONE_DAY_IN_MS * 10 + ONE_HOUR_IN_MS * 6 + ONE_MIN_IN_MS * 39 + 56_789
    expect(transformMsToReadableString(duration)).toMatchInlineSnapshot(
      '"10 days, 6 hours, 39 minutes and 56.79 seconds"',
    )
  })

  test("Duration is readable string - ones", () => {
    const duration = ONE_DAY_IN_MS + ONE_HOUR_IN_MS + ONE_MIN_IN_MS + 1_000
    expect(transformMsToReadableString(duration)).toMatchInlineSnapshot(
      '"1 day, 1 hour, 1 minute and 1 second"',
    )
  })

  test("capitalize", () => {
    expect(capitalize("hello world")).toMatchInlineSnapshot('"Hello world"')
  })

  test("toKebabCase", () => {
    expect(toKebabCase("helloWorld 123")).toMatchInlineSnapshot(
      '"hello-world-123"',
    )
  })

  test("cleanup text", () => {
    expect(cleanupText("helloâ€”world")).toMatchInlineSnapshot('"hello:world"')
  })

  test("cleanup text - undefined", () => {
    expect(cleanupText()).toBeUndefined()
  })
})
