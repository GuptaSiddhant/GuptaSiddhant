/** @vitest-environment jsdom */

import { expect, test } from "vitest"

import { parseFormDataWithModelObject } from "./parser"
import type { ModelObjectType } from "./types"

test("FormData with object model", () => {
  const model: ModelObjectType = {
    type: "object",
    properties: {
      id: { type: "string", required: true },
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
    },
  }

  const formData = new FormData()
  formData.set("id", "info")
  formData.set("about.name", "ABC")
  formData.set("about.age", "22")
  formData.set("about.online", "on")
  formData.set("about.gender", "o")
  formData.set("links.0.url", "https://github.com")
  formData.set("links.0.alt", "github")
  formData.set("links.1.url", "https://linkedin.com")
  formData.set("links.1.alt", "linkedin")

  const expected = {
    id: "info",
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
  }

  const actual = parseFormDataWithModelObject(formData, model)
  expect(actual).toEqual(expected)
})
