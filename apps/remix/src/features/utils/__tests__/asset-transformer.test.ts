import { describe, expect, test } from "vitest";

import { generateAssetTransformedUrl } from "../asset-transformer";

describe("generateAssetTransformedUrl", () => {
  const url = new URL("/", "http://x.z").toString();

  test("return undefined with missing url", () => {
    expect(generateAssetTransformedUrl()).toBeUndefined();
  });

  test("return transformed url with default options", () => {
    expect(generateAssetTransformedUrl(url)).toBe(
      "http://x.z/?f=auto&fl=progressive",
    );
  });

  test("return transformed url with provided options", () => {
    expect(generateAssetTransformedUrl(url, { aspectRatio: 2 })).toBe(
      "http://x.z/?ar=2&c=fill&f=auto&fl=progressive",
    );
    expect(generateAssetTransformedUrl(url, { dpr: 2 })).toBe(
      "http://x.z/?c=fill&dpr=2&f=auto&fl=progressive",
    );
    expect(generateAssetTransformedUrl(url, { height: 100 })).toBe(
      "http://x.z/?c=fill&f=auto&fl=progressive&h=100",
    );
    expect(generateAssetTransformedUrl(url, { width: 100 })).toBe(
      "http://x.z/?c=fill&f=auto&fl=progressive&w=100",
    );
    expect(generateAssetTransformedUrl(url, { quality: 2 })).toBe(
      "http://x.z/?c=fill&f=auto&fl=progressive&q=2",
    );
    expect(generateAssetTransformedUrl(url, { resize: "crop" })).toBe(
      "http://x.z/?c=crop&f=auto&fl=progressive",
    );
    expect(generateAssetTransformedUrl(url, { resizeOrigin: "center" })).toBe(
      "http://x.z/?c=fill&f=auto&fl=progressive&g=center",
    );
  });
});
