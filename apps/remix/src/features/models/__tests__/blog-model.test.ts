import { ModelName } from "..";
import { describe, expect, test } from "vitest";

import { generateStructuredDataForBlogPost } from "../blog.model";

describe("generateStructuredDataForBlogPost", () => {
  test("", () => {
    expect(
      generateStructuredDataForBlogPost({
        data: {
          post: {
            id: "test-post",
            model: ModelName.Blog,
            title: "Test post",
            gallery: [{ url: "/image.png", alt: "" }],
          },
          url: "http://x.z/blog/test-post",
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
          "@id": "http://x.z/blog/test-post",
          "@type": "WebPage",
        },
        "url": "http://x.z/blog/test-post",
      }
    `);

    expect(
      generateStructuredDataForBlogPost({
        data: {
          post: {
            id: "test-post",
            model: ModelName.Blog,
            title: "Test post",
            gallery: [{ url: "/image.png", alt: "" }],
          },
          url: "http://x.z/blog/test-post",
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
            "@id": "http://x.z/blog/test-post",
            "@type": "WebPage",
          },
          "url": "http://x.z/blog/test-post",
        }
      `);
  });
});
