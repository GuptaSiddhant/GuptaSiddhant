/** @vitest-environment jsdom */

import { expect, test } from "vitest";

import parseFormDataWithModelObject from "./parser";
import type { ModelObjectType } from "./types";

test("FormData with object model", () => {
  const model: ModelObjectType = {
    type: "object",
    properties: {
      id: { type: "string", required: true },
      title: { type: "string" },
      about: {
        type: "object",
        required: true,
        properties: {
          name: { type: "string", required: true },
          age: { type: "number" },
          online: { type: "boolean" },
          gender: { type: "string", enum: ["m", "f", "o"] },
        },
      },
      links: {
        type: "array",
        items: {
          type: "object",
          properties: {
            url: { type: "string", required: true },
            alt: { type: "string" },
          },
        },
      },
      tags: {
        type: "array",
        items: {
          type: "string",
        },
      },
      featured: { type: "boolean" },
      premium: { type: "boolean" },
      draft: { type: "boolean" },
      views: { type: "number" },
    },
  };

  const formData = new FormData();
  formData.append("id", "info");
  formData.append("about.name", "ABC");
  formData.append("about.age", "22");
  formData.append("about.online", "on");
  formData.append("about.gender", "o");
  formData.append("links.0.url", "https://github.com");
  formData.append("links.0.alt", "github");
  formData.append("links.1.url", "https://linkedin.com");
  formData.append("links.1.alt", "linkedin");
  formData.append("tags", "design");
  formData.append("tags", "code");
  formData.append("featured", "on");
  formData.append("premium", "true");

  const expected = {
    id: "info",
    title: "",
    about: {
      name: "ABC",
      age: 22,
      online: true,
      gender: "o",
    },
    links: [
      { url: "https://github.com", alt: "github" },
      { url: "https://linkedin.com", alt: "linkedin" },
    ],
    tags: ["design", "code"],
    featured: true,
    premium: true,
    draft: false,
    views: 0,
  };

  const actual = parseFormDataWithModelObject(formData, model);
  expect(actual).toEqual(expected);
});

test("throws error when a file is included", () => {
  const model: ModelObjectType = {
    type: "object",
    properties: { name: { type: "string" } },
  };

  const formData = new FormData();
  formData.append("name", new Blob());

  expect(() => parseFormDataWithModelObject(formData, model)).toThrow(
    `'File' cannot be parsed as FormValue.`,
  );
});
