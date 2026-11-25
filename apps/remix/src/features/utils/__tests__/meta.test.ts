import { describe, expect, test } from "vite-plus/test";

import { createMetaTitle, generateArticleMeta } from "../meta";
import { AUTHOR_NAME, AUTHOR_SHORT_NAME } from "@gs/constants";
import { ModelName } from "@gs/models";

describe.concurrent("createMetaTitle", () => {
  test("return author name when title is undefined", () => {
    expect(createMetaTitle()).toBe(AUTHOR_NAME);
  });

  test("return title with author short name when title is defined", () => {
    expect(createMetaTitle("Title")).toBe(`Title | ${AUTHOR_SHORT_NAME}`);
  });
});

describe.concurrent("generateArticleMeta", () => {
  test("undefined article and options", () => {
    expect(generateArticleMeta()).toMatchInlineSnapshot(`
      [
        {
          "title": "Article 404",
        },
        {
          "content": "Article 'undefined' not found",
          "name": "description",
        },
      ]
    `);
  });

  test("generate meta properties for an summary item", () => {
    expect(
      generateArticleMeta({
        id: "test-post",
        model: ModelName.Blog,
        title: "Test post",
      }),
    ).toMatchInlineSnapshot(`
      [
        {
          "title": "Test post | GS",
        },
        {
          "content": "",
          "name": "description",
        },
        {
          "content": "summary_large_image",
          "name": "twitter:card",
        },
        {
          "content": "Test post",
          "property": "og:title",
        },
        {
          "content": "",
          "property": "og:description",
        },
        {
          "content": "Siddhant Gupta",
          "property": "og:author",
        },
        {
          "content": "/social-image.png?title=Test+post&subtitle=&imageUrl=&url=&caption=&authorName=Siddhant+Gupta&authorImageUrl=https%3A%2F%2Fpeople.aalto.fi%2Ffiles%2F1201903_x_512_3to4.jpg",
          "property": "og:image",
        },
        {
          "content": undefined,
          "property": "og:url",
        },
        {
          "content": "article",
          "property": "og:type",
        },
        {
          "content": undefined,
          "property": "og:section",
        },
        {
          "content": "",
          "property": "og:tag",
        },
        {
          "content": undefined,
          "property": "og:published_time",
        },
        {
          "content": undefined,
          "property": "og:article:published_time",
        },
        {
          "content": undefined,
          "property": "og:article:section",
        },
        {
          "content": "",
          "property": "og:article:tag",
        },
        {
          "content": "Siddhant Gupta",
          "property": "og:article:author",
        },
        {
          "script:ld+json": {
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "author": {
              "@type": "Person",
              "name": "Siddhant Gupta",
            },
            "datePublished": undefined,
            "description": undefined,
            "headline": "Test post",
            "image": undefined,
            "mainEntityOfPage": {
              "@id": "",
              "@type": "WebPage",
            },
            "url": "",
          },
        },
      ]
    `);
  });

  test("generate meta properties for an summary item", () => {
    expect(
      generateArticleMeta(
        {
          id: "test-post",
          model: ModelName.Blog,
          title: "Test post",
          date: "2022-09-20",
        },
        {
          url: "https://x.com/blog/test-post",
          section: "Blog",
          matches: [],
        },
      ),
    ).toMatchInlineSnapshot(`
      [
        {
          "title": "Test post | GS",
        },
        {
          "content": "",
          "name": "description",
        },
        {
          "content": "summary_large_image",
          "name": "twitter:card",
        },
        {
          "content": "Test post",
          "property": "og:title",
        },
        {
          "content": "",
          "property": "og:description",
        },
        {
          "content": "Siddhant Gupta",
          "property": "og:author",
        },
        {
          "content": "https://x.com/social-image.png?title=Test+post&subtitle=&imageUrl=&url=https%3A%2F%2Fx.com%2Fblog%2Ftest-post&caption=Blog&authorName=Siddhant+Gupta&authorImageUrl=https%3A%2F%2Fpeople.aalto.fi%2Ffiles%2F1201903_x_512_3to4.jpg",
          "property": "og:image",
        },
        {
          "content": "https://x.com/blog/test-post",
          "property": "og:url",
        },
        {
          "content": "article",
          "property": "og:type",
        },
        {
          "content": "Blog",
          "property": "og:section",
        },
        {
          "content": "",
          "property": "og:tag",
        },
        {
          "content": "2022-09-20T00:00:00.000Z",
          "property": "og:published_time",
        },
        {
          "content": "2022-09-20T00:00:00.000Z",
          "property": "og:article:published_time",
        },
        {
          "content": "Blog",
          "property": "og:article:section",
        },
        {
          "content": "",
          "property": "og:article:tag",
        },
        {
          "content": "Siddhant Gupta",
          "property": "og:article:author",
        },
        {
          "script:ld+json": {
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "author": {
              "@type": "Person",
              "name": "Siddhant Gupta",
            },
            "datePublished": "2022-09-20",
            "description": undefined,
            "headline": "Test post",
            "image": undefined,
            "mainEntityOfPage": {
              "@id": "https://x.com/blog/test-post",
              "@type": "WebPage",
            },
            "url": "https://x.com/blog/test-post",
          },
        },
      ]
    `);
  });
});
