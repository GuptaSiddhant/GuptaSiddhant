import { describe, expect, test } from "vitest";

import { filterUniqueTagsByOccurrence } from "../tags";

describe.concurrent("filterUniqueTagsByOccurrence", () => {
  test("", () => {
    expect(
      filterUniqueTagsByOccurrence([
        "tag1",
        "tag2",
        "tag1",
        "tag2",
        "tag2",
        "tag1",
        "tag1",
        "tag3",
        "",
      ]),
    ).toMatchInlineSnapshot(`
      [
        {
          "occurrence": 4,
          "value": "tag1",
        },
        {
          "occurrence": 3,
          "value": "tag2",
        },
        {
          "occurrence": 2,
          "value": "tag4",
        },
      ]
    `);
  });
});
