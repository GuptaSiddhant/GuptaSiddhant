import type { AboutInfo, ExperienceProps, Skills, TeaserProps } from "../types"
import useQuery from "./useQuery"

export const careerQuery = `type=career`

export const educationQuery = `type=education`

export const projectsQuery = `type=projects`

export const blogQuery = `type=blog`

export function useAboutQuery() {
  return useQuery<AboutInfo>("type=about")
}

export function useSkillsQuery() {
  return useQuery<Skills>("type=skills")
}

export function useCareerQuery() {
  return useQuery<ExperienceProps[]>("type=career")
}

export function useEducationQuery() {
  return useQuery<ExperienceProps[]>("type=education")
}

export function useProjectsQuery() {
  return useQuery<TeaserProps[]>("type=projects")
}

export function useBlogQuery() {
  return useQuery<TeaserProps[]>("type=blog")
}
