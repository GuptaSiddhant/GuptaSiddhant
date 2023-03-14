import { describe, expect, test } from "vitest";

import {
  extractTocFromMdx,
  generateHeadingId,
  transformContentToMdx,
} from "../mdx";

describe.concurrent("generateHeadingId", () => {
  test("should extract kebab-case id from string", () => {
    expect(generateHeadingId("Hello World")).toBe("hello-world");
  });

  test("should extract kebab-case id from number", () => {
    expect(generateHeadingId(10)).toBe("10");
  });
});

describe.concurrent("transformContentToMdx", () => {
  test("returns same string if it is not wrapped in quotes", () => {
    expect(transformContentToMdx()).toBeUndefined();
    expect(transformContentToMdx("hello-world")).toBe("hello-world");
  });

  test("returns parsed string if it is wrapped in quotes", () => {
    expect(transformContentToMdx('"hello-world"')).toBe("hello-world");
  });
});

describe.concurrent("extractTocFromMdx", () => {
  test("return empty list when mdx string is not provided/undefined", () => {
    expect(extractTocFromMdx()).toEqual([]);
  });

  const mdxString = `
  # Heading 1
  Content under heading 1
  ## Heading 2-1
  Content under heading 2-1
  ### Heading 3-1
  Content under heading 3-1
  ## Heading 2-2
  Content under heading 2-2
  ### Heading 3-2
  Content under heading 3-2
  `;

  test("", () => {
    expect(extractTocFromMdx(mdxString)).toMatchInlineSnapshot(`
      [
        {
          "children": [],
          "id": "heading-1",
          "level": 1,
          "text": "Heading 1",
        },
        {
          "children": [],
          "id": "heading-2-1",
          "level": 2,
          "text": "Heading 2-1",
        },
        {
          "children": [],
          "id": "heading-3-1",
          "level": 3,
          "text": "Heading 3-1",
        },
        {
          "children": [],
          "id": "heading-2-2",
          "level": 2,
          "text": "Heading 2-2",
        },
        {
          "children": [],
          "id": "heading-3-2",
          "level": 3,
          "text": "Heading 3-2",
        },
      ]
    `);
  });
});
