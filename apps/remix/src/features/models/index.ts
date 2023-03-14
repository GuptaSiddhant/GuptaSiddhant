import clsx from "clsx";

import * as about from "./about-info.model";
import * as skills from "./about-skills.model";
import * as blog from "./blog.model";
import * as career from "./career.model";
import * as education from "./education.model";
import type { Model, ModelObjectType, ModelStyling } from "./helpers/types";
import * as projects from "./projects.model";
import * as users from "./users.model";

export enum ModelName {
  Projects = "projects",
  Blog = "blog",
  About = "about",
  Testimonies = "testimonies",
  Education = "education",
  Career = "career",
  Users = "users",
  Index = "index",
  Skills = "skills",
}

export type { Model };

export function getModelByModelName(modelName: ModelName): ModelObjectType {
  switch (modelName) {
    case ModelName.Career:
      return career.model;
    case ModelName.Education:
      return education.model;
    case ModelName.Blog:
      return blog.model;
    case ModelName.Projects:
      return projects.model;
    case ModelName.About:
      return about.model;
    case ModelName.Skills:
      return skills.model;
    case ModelName.Users:
      return users.model;
    default:
      throw new Error(`Unknown model name: ${modelName}`);
  }
}

export function getStylingByModelName(modelName: ModelName): ModelStyling {
  switch (modelName) {
    case ModelName.Career:
      return career.styling;
    case ModelName.Education:
      return education.styling;
    case ModelName.Projects:
      return projects.styling;
    case ModelName.Blog:
      return blog.styling;
    default: {
      return {
        bg: clsx("bg-secondary"),
        text: clsx("text-secondary"),
        border: clsx("border-secondary"),
        borderHocus: clsx(
          "selected:border-secondary group-hocus:border-secondary",
        ),
      };
    }
  }
}

export function getLabelByModelName(modelName: ModelName): string {
  let label: string = "";
  Object.entries(ModelName).forEach(([key, value]) => {
    if (value === modelName) {
      label = key;
    }
  });

  return label;
}

export function verifyValidModelName(name: string): boolean {
  return Object.values(ModelName).includes(name);
}
