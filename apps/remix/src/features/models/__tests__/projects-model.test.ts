import { ModelName } from "..";
import { describe, expect, test } from "vitest";

import { generateStructuredDataForProject } from "../projects.model";

describe("generateStructuredDataForProject", () => {
  test("generates structured data for a project", () => {
    expect(
      generateStructuredDataForProject({
        data: {
          project: {
            id: "test-post",
            model: ModelName.Projects,
            title: "Test post",
            gallery: [{ url: "/image.png", alt: "" }],
            dateStart: "2022-01-01",
          },
          url: "http://x.z/projects/test-post",
        },
        // @ts-expect-error
        parentsData: [{ about: { name: "GS" } }],
      }),
    ).toMatchInlineSnapshot(`
      {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "author": {
          "@type": "Person",
          "name": "GS",
        },
        "datePublished": undefined,
        "description": undefined,
        "headline": "Test post",
        "image": [
          "http://x.z/image.png",
        ],
        "mainEntityOfPage": {
          "@id": "http://x.z/projects/test-post",
          "@type": "WebPage",
        },
        "url": "http://x.z/projects/test-post",
      }
    `);

    expect(
      generateStructuredDataForProject({
        data: {
          project: {
            id: "test-post",
            model: ModelName.Projects,
            title: "Test post",
            gallery: [{ url: "/image.png", alt: "" }],
            dateStart: "2022-01-01",
          },
          url: "http://x.z/projects/test-post",
        },
        // @ts-expect-error
        parentsData: [{}],
      }),
    ).toMatchInlineSnapshot(`
      {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "author": {
          "@type": "Person",
          "name": "",
        },
        "datePublished": undefined,
        "description": undefined,
        "headline": "Test post",
        "image": [
          "http://x.z/image.png",
        ],
        "mainEntityOfPage": {
          "@id": "http://x.z/projects/test-post",
          "@type": "WebPage",
        },
        "url": "http://x.z/projects/test-post",
      }
    `);
  });
});
