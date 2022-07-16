import { Sections } from "@gs/resume/helpers"
import Button from "@gs/ui/Button"
import { ErrorSection } from "@gs/ui/Error"
import Section from "@gs/ui/Section"
import { Link, useLoaderData } from "@remix-run/react"
import type {
  ErrorBoundaryComponent,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/server-runtime"
import { json } from "@remix-run/server-runtime"
import { useMemo, useState } from "react"

import { createMetaTitle } from "~/features/helpers/meta"
import { filterUniqueTagsByOccurrence } from "~/features/teaser/helpers"
import Input from "~/features/ui/Input"
import { ExternalLink } from "~/features/ui/Link"
import { H1 } from "~/features/ui/Text"
import { capitalize } from "~/features/utils/format"

const tags: string[] = filterUniqueTagsByOccurrence(
  [
    "Code",
    "Design",
    "Management",
    "Entrepreneur",
    "Engineering",
    "Web",
    "Startup",
    "Mobile",
    "Admissions",
    "Marketing",
  ].map((t) => t.toLowerCase()),
).map((t) => t.value)

interface LoaderData {
  origin: string
}

export const loader: LoaderFunction = async ({ request }) => {
  const { origin } = new URL(request.url)
  return json<LoaderData>({ origin })
}

export const meta: MetaFunction = () => ({
  title: createMetaTitle("Resume builder"),
})

export default function Resume(): JSX.Element {
  const { origin } = useLoaderData<LoaderData>()
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
    <Section className="mx-auto !grid max-w-5xl gap-4 p-4 md:grid-cols-2">
      <H1 className="col-span-2">Resume builder</H1>

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
        className="aspect-[3/4] w-full"
      />
    </Section>
  )
}

export const ErrorBoundary: ErrorBoundaryComponent = ({ error }) => {
  return <ErrorSection title="Problem with resume" error={error} />
}
