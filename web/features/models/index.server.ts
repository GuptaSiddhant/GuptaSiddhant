import { ModelName } from "."
import {
  type AboutInfo,
  type Skills,
  getAboutInfo,
  getAboutSkills,
} from "./about/index.server"
import { type BlogPostProps, getBlogPost } from "./blog/index.server"
import { type CareerProps, getCareerItem } from "./career/index.server"
import { type EducationProps, getEducationItem } from "./education/index.server"
import { type ProjectProps, getProject } from "./projects/index.server"

export async function getItemByModelName(
  modelName: ModelName.Career,
  id: string,
): Promise<CareerProps>
export async function getItemByModelName(
  modelName: ModelName.Education,
  id: string,
): Promise<EducationProps>
export async function getItemByModelName(
  modelName: ModelName.Projects,
  id: string,
): Promise<ProjectProps>
export async function getItemByModelName(
  modelName: ModelName.Blog,
  id: string,
): Promise<BlogPostProps>
export async function getItemByModelName(
  modelName: ModelName.About,
  id: never,
): Promise<AboutInfo>
export async function getItemByModelName(
  modelName: ModelName.Skills,
  id: never,
): Promise<Skills>
export async function getItemByModelName(
  modelName: ModelName,
  id: string,
): Promise<{ id: string; [key: string]: any }>
export async function getItemByModelName(
  modelName: ModelName,
  id?: string,
): Promise<any> {
  if (!id) {
    switch (modelName) {
      case ModelName.About:
        return getAboutInfo
      case ModelName.Skills:
        return getAboutSkills
      default:
        throw new Error(`Unknown model name: ${modelName}`)
    }
  }

  switch (modelName) {
    case ModelName.Career:
      return getCareerItem(id)
    case ModelName.Education:
      return getEducationItem(id)
    case ModelName.Blog:
      return getBlogPost(id)
    case ModelName.Projects:
      return getProject(id)
    default:
      throw new Error(`Unknown model name: ${modelName}`)
  }
}
