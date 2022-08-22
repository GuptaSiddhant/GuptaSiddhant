/** @vitest-environment jsdom */

import { expect, test } from "vitest"

import { parseFormDataWithModelObject } from "./parser"
import type { ModelObjectType } from "./types"

test("FormData with object model", () => {
  const model: ModelObjectType = {
    type: "object",
    properties: {
      id: { type: "string", required: true },
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
  formData.set("id", "links")
  formData.set("links.0.url", "https://github.com")
  formData.set("links.0.alt", "github")
  formData.set("links.1.url", "https://linkedin.com")
  formData.set("links.1.alt", "linkedin")

  const expected = {
    id: "links",
    links: [
      { url: "https://github.com", alt: "github" },
      { url: "https://linkedin.com", alt: "linkedin" },
    ],
  }

  const actual = parseFormDataWithModelObject(formData, model)
  expect(actual).toEqual(expected)
})

test("FormData with array of array", () => {
  const model: ModelObjectType = {
    type: "object",
    properties: {
      id: { type: "string", required: true },
      marks: {
        type: "array",
        items: { type: "array", items: { type: "number" } },
      },
    },
  }

  const formData = new FormData()
  formData.set("id", "marks")
  formData.set("marks.0", "100, 99, 98")
  formData.set("marks.1", "90,91, 92")
  formData.set("marks.2", "60,  70,    80")

  const expected = {
    id: "marks",
    marks: [
      [100, 99, 98],
      [90, 91, 92],
      [60, 70, 80],
    ],
  }

  const actual = parseFormDataWithModelObject(formData, model)
  expect(actual).toEqual(expected)
})
