/** @vitest-environment jsdom */
import { describe, expect, test } from "vitest";

import {
  dateSortPredicate,
  formDataStringOnlyEntriesFilterPredicate,
  uniqueFilterPredicate,
} from "../predicates";

describe.concurrent("dateSortPredicate", () => {
  const todayDate = new Date();
  const futureDate = new Date(
    todayDate.getFullYear() + 1,
    todayDate.getMonth(),
    todayDate.getDate(),
  );
  const pastDate = new Date(
    todayDate.getFullYear() - 1,
    todayDate.getMonth(),
    todayDate.getDate(),
  );

  test("returns 0 when both dates are undefined, descending order", () => {
    expect(dateSortPredicate(undefined, undefined)).toBe(0);
  });
  test("returns 0 when both dates are same, descending order", () => {
    expect(dateSortPredicate(todayDate, todayDate)).toBe(0);
  });
  test("returns 0 when both dates are undefined, ascending order", () => {
    expect(dateSortPredicate.ascending(undefined, undefined)).toBe(0);
  });
  test("returns 0 when both dates are same, ascending order", () => {
    expect(dateSortPredicate.ascending(todayDate, todayDate)).toBe(0);
  });
  test("returns -1 when single future date is passed, descending order", () => {
    expect(dateSortPredicate(futureDate, undefined)).toBe(-1);
  });
  test("returns 1 when single future date is passed, ascending order", () => {
    expect(dateSortPredicate.ascending(futureDate, undefined)).toBe(1);
  });
  test("returns 1 when single past date is passed, descending order", () => {
    expect(dateSortPredicate(pastDate, undefined)).toBe(1);
  });
  test("returns -1 when single past date is passed, ascending order", () => {
    expect(dateSortPredicate.ascending(pastDate, undefined)).toBe(-1);
  });
  test("returns 1 when past and future dates are passed, ascending order", () => {
    expect(dateSortPredicate(pastDate, futureDate)).toBe(1);
  });
  test("returns -1 when past and future dates are passed, ascending order", () => {
    expect(dateSortPredicate.ascending(pastDate, futureDate)).toBe(-1);
  });

  test("returns sorted array of dates in descending order", () => {
    expect([todayDate, futureDate, pastDate].sort(dateSortPredicate)).toEqual([
      futureDate,
      todayDate,
      pastDate,
    ]);
  });
  test("returns sorted array of dates in ascending order", () => {
    expect(
      [todayDate, futureDate, pastDate].sort(dateSortPredicate.ascending),
    ).toEqual([pastDate, todayDate, futureDate]);
  });
});

describe.concurrent("formDataStringOnlyEntriesFilterPredicate", () => {
  const file = new File([], "filename");

  test("returns false when entry contains File value", () => {
    expect(formDataStringOnlyEntriesFilterPredicate(["key", file])).toBe(false);
  });

  test("returns true when entry contains string value", () => {
    expect(formDataStringOnlyEntriesFilterPredicate(["key", "value"])).toBe(
      true,
    );
  });

  test("returns filtered entries with only string values", () => {
    const formEntries: [string, FormDataEntryValue][] = [
      ["key1", "string"],
      ["key2", file],
      // @ts-expect-error
      ["key2", false],
    ];

    expect(
      formEntries.filter(formDataStringOnlyEntriesFilterPredicate),
    ).toEqual([["key1", "string"]]);
  });
});

describe.concurrent("uniqueFilterPredicate", () => {
  const numericArray = [0, 1, 2, 3, 2, 1, 0];

  test("returns true when index match the first occurrence", () => {
    expect(uniqueFilterPredicate(0, 0, numericArray)).toBe(true);
    expect(uniqueFilterPredicate(1, 1, numericArray)).toBe(true);
  });

  test("returns false when index does not match the first occurrence", () => {
    expect(uniqueFilterPredicate(0, 6, numericArray)).toBe(false);
    expect(uniqueFilterPredicate(1, 5, numericArray)).toBe(false);
  });

  test("returns array unique items when used to filter an array of primitive items", () => {
    expect(numericArray.filter(uniqueFilterPredicate)).toEqual([0, 1, 2, 3]);

    const stringArray = ["0", "1", "2", "2", "1", "0"];
    expect(stringArray.filter(uniqueFilterPredicate)).toEqual(["0", "1", "2"]);
  });

  test("returns unfiltered array when used to filter an array of non-primitive items", () => {
    const objectArray = [{ id: "0" }, { id: "1" }, { id: "0" }];
    expect(objectArray.filter(uniqueFilterPredicate)).toEqual(objectArray);
  });

  describe("uniqueFilterPredicate.withMatcher", () => {
    test("returns filtered array for non-primitive array when provided correct matcher", () => {
      type ObjectWithId = { id: string };

      const objectArray: Array<ObjectWithId> = [
        { id: "0" },
        { id: "1" },
        { id: "0" },
      ];

      const objectUniqueArray: Array<ObjectWithId> = [{ id: "0" }, { id: "1" }];

      expect(
        objectArray.filter(
          uniqueFilterPredicate.withMatcher(
            (a: ObjectWithId, b: ObjectWithId) => a.id === b.id,
          ),
        ),
      ).toEqual(objectUniqueArray);
    });
  });
});
