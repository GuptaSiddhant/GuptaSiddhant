import { describe, expect, test } from "vitest";

import { CLOUDINARY_BASE_URL, generateCloudinaryUrl } from "../cloudinary";
import { generateAssetTransformations } from "@gs/utils/asset-transformer";

describe("generateCloudinaryUrl", () => {
  test("", () => {
    expect(
      generateCloudinaryUrl(
        "image.png",
        generateAssetTransformations({}, true),
      ),
    ).toBe(`${CLOUDINARY_BASE_URL}image.png?tx=f_auto,fl_progressive`);

    expect(generateCloudinaryUrl("image.png")).toBe(
      `${CLOUDINARY_BASE_URL}image.png?tx=`,
    );
  });
});
