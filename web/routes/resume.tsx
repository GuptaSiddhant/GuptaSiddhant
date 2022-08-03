import { useMemo, useState } from "react"

import { useLoaderData } from "@remix-run/react"
import type {
  ErrorBoundaryComponent,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/server-runtime"
import { json } from "@remix-run/server-runtime"

import { filterUniqueTagsByOccurrence } from "@gs/helpers/filter"
import { createMetaTitle } from "@gs/helpers/meta"
import { getCareerSummaryItems } from "@gs/models/career.server"
import { getEducationSummaryItems } from "@gs/models/education.server"
import { Sections } from "@gs/resume/helpers"
import Button from "@gs/ui/Button"
import { ErrorSection } from "@gs/ui/Error"
import Input from "@gs/ui/Input"
import { ExternalLink } from "@gs/ui/Link"
import Section from "@gs/ui/Section"
import { H1 } from "@gs/ui/Text"
import { capitalize } from "@gs/utils/format"

interface LoaderData {
  origin: string
  tags: string[]
}

export const loader: LoaderFunction = async ({ request }) => {
  const { origin } = new URL(request.url)
  const [educationList, careerList] = await Promise.all([
    getEducationSummaryItems(),
    getCareerSummaryItems(),
  ])

  const tags =
    filterUniqueTagsByOccurrence(
      [...educationList, ...careerList].flatMap((item) => item.tags || []),
    ).map((t) => t.value.toLowerCase()) || []

  return json<LoaderData>({ origin, tags })
}

export const meta: MetaFunction = () => ({
  title: createMetaTitle("Resume builder"),
})

export default function Resume(): JSX.Element {
  const { origin, tags } = useLoaderData<LoaderData>()
  const [query, setQuery] = useState("")

  const resumeUrl = useMemo(
    () => origin + ["/resume.pdf", query].filter(Boolean).join("?"),
    [query, origin],
  )

  const handleSubmit = (form: HTMLFormElement): void => {
    const formData = new FormData(form).entries()
    const searchParams = new URLSearchParams(formData as any)
    for (const x of searchParams.keys()) {
      const value = searchParams.get(x)

      if (value === "") searchParams.delete(x)
    }
    setQuery(searchParams.toString())
  }

  return (
    <Section className="mx-auto !grid max-w-5xl grid-cols-1 gap-4 p-4 md:grid-cols-2">
      <H1 className="col-span-full">Resume builder</H1>

      <form
        method="get"
        action="/resume.pdf"
        className="flex flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault()
          handleSubmit(e.currentTarget)
        }}
      >
        <fieldset className="border-b border-divider pb-4">
          <legend className="mt-4 mb-2 font-bold">Time period</legend>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label={"From"}
              labelClassName={"flex flex-col text-base flex-1"}
              type="date"
              pattern="^\\d{4}-\\d{2}-\\d{2}$"
              placeholder="YYYY-MM-DD"
              name={"from"}
            />
            <Input
              label={"Till"}
              labelClassName={"flex flex-col text-sm flex-1"}
              type="date"
              pattern="^\\d{4}-\\d{2}-\\d{2}$"
              placeholder="YYYY-MM-DD"
              name={"till"}
            />
          </div>
        </fieldset>

        <fieldset className="border-b border-divider pb-4">
          <legend className="mt-4 mb-2 font-bold">Include sections</legend>
          <div className="grid grid-cols-3 gap-x-4 gap-y-2">
            {Object.values(Sections).map((value) =>
              value !== "about" ? (
                <label
                  key={value}
                  className="flex items-center gap-2 text-base"
                >
                  <input type="checkbox" name="section" value={value} />
                  {capitalize(value)}
                </label>
              ) : null,
            )}
          </div>
        </fieldset>

        <fieldset className="border-b border-divider pb-4">
          <legend className="mt-4 mb-2 font-bold">Tags</legend>
          <div className="grid grid-cols-3 gap-x-4 gap-y-2">
            {tags.map((tag) => (
              <label key={tag} className="flex items-center gap-2 text-base">
                <input type="checkbox" name="tag" value={tag} />
                {capitalize(tag)}
              </label>
            ))}
            <label className="col-span-3 flex flex-col text-sm">
              {"Other tags"}
              <Input
                type="text"
                name="tag"
                placeholder="Comma separated tags"
                className="w-full"
              />
            </label>
          </div>
        </fieldset>

        <Button.Primary type="submit" className="justify-center">
          Generate PDF
        </Button.Primary>

        <p>
          Generated PDF is available at: <br />
          <ExternalLink
            href={resumeUrl}
            className="whitespace-pre-wrap break-all font-monospace text-sm"
          >
            {resumeUrl}
          </ExternalLink>
        </p>
      </form>

      <iframe
        title="resume-pdf"
        src={resumeUrl}
        className="aspect-[7/10] w-full"
      />
    </Section>
  )
}

export const ErrorBoundary: ErrorBoundaryComponent = ({ error }) => {
  return <ErrorSection title="Problem with resume" error={error} />
}
