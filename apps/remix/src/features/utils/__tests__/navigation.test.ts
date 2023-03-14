import { isExternalLink, parseGetAllSearchParams } from "../navigation";
import { describe, expect, test } from "vitest";

describe("isExternalLink", () => {
  test("return false when not an external link", () => {
    expect(isExternalLink("/path")).toBe(false);
  });

  test("return true when an external link or email link", () => {
    expect(isExternalLink("https://path")).toBe(true);
    expect(isExternalLink("mailto:a@b.c")).toBe(true);
  });
});

describe("parseGetAllSearchParams", () => {
  const searchParams = new URLSearchParams();
  searchParams.append("query", "dev");
  searchParams.append("tag", "work");
  searchParams.append("tag", "study");

  test("get param value if exist", () => {
    expect(parseGetAllSearchParams(searchParams, "query")).toEqual(["dev"]);
    expect(parseGetAllSearchParams(searchParams, "tag")).toEqual([
      "work",
      "study",
    ]);
  });

  test("get empty array does not exist", () => {
    // @ts-expect-error
    expect(parseGetAllSearchParams()).toEqual([]);
    // @ts-expect-error
    expect(parseGetAllSearchParams(searchParams)).toEqual([]);
    expect(parseGetAllSearchParams(searchParams, "test")).toEqual([]);
  });
});
