import { describe, expect, test } from "vitest";

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
      {
        "description": "Article 'undefined' not found",
        "title": "Article 404",
      }
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
      {
        "description": undefined,
        "og:article:author": "Siddhant Gupta",
        "og:article:published_time": undefined,
        "og:article:section": undefined,
        "og:article:tag": "",
        "og:author": "Siddhant Gupta",
        "og:description": undefined,
        "og:image": "/social-image.png?title=Test+post&subtitle=&imageUrl=&url=&caption=&authorName=Siddhant+Gupta&authorImageUrl=https%3A%2F%2Fpeople.aalto.fi%2Ffiles%2F1201903_x_512_3to4.jpg",
        "og:published_time": undefined,
        "og:section": undefined,
        "og:tag": "",
        "og:title": "Test post",
        "og:type": "article",
        "og:url": undefined,
        "title": "Test post | GS",
        "twitter:card": "summary_large_image",
      }
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
        },
      ),
    ).toMatchInlineSnapshot(`
      {
        "description": undefined,
        "og:article:author": "Siddhant Gupta",
        "og:article:published_time": "2022-09-20T00:00:00.000Z",
        "og:article:section": "Blog",
        "og:article:tag": "",
        "og:author": "Siddhant Gupta",
        "og:description": undefined,
        "og:image": "https://x.com/social-image.png?title=Test+post&subtitle=&imageUrl=&url=https%3A%2F%2Fx.com%2Fblog%2Ftest-post&caption=Blog&authorName=Siddhant+Gupta&authorImageUrl=https%3A%2F%2Fpeople.aalto.fi%2Ffiles%2F1201903_x_512_3to4.jpg",
        "og:published_time": "2022-09-20T00:00:00.000Z",
        "og:section": "Blog",
        "og:tag": "",
        "og:title": "Test post",
        "og:type": "article",
        "og:url": "https://x.com/blog/test-post",
        "title": "Test post | GS",
        "twitter:card": "summary_large_image",
      }
    `);
  });
});
