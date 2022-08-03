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
import {
  ResumeFonts,
  ResumePalettes,
  ResumeSections,
} from "@gs/resume/constants"
import Button from "@gs/ui/Button"
import { ErrorSection } from "@gs/ui/Error"
import Input from "@gs/ui/Input"
import { ExternalLink } from "@gs/ui/Link"
import Section from "@gs/ui/Section"
import Select from "@gs/ui/Select"
import Tags from "@gs/ui/Tags"
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
        <DateFilter />
        <SectionFilter />
        <TagFilter tags={tags} />
        <StyleFilter />

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

// Components

function DateFilter(): JSX.Element | null {
  const commonInputProps = {
    labelClassName: "flex flex-col text-base flex-1",
    type: "date",
    pattern: "^\\d{4}-\\d{2}-\\d{2}$",
    placeholder: "YYYY-MM-DD",
  }

  return (
    <fieldset className="border-b border-divider pb-4">
      <legend className="mt-4 mb-2 font-bold">Time period</legend>
      <div className="grid grid-cols-2 gap-4">
        <Input {...commonInputProps} label={"From"} name={"from"} />
        <Input {...commonInputProps} label={"Till"} name={"till"} />
      </div>
    </fieldset>
  )
}

function SectionFilter(): JSX.Element | null {
  return (
    <fieldset className="border-b border-divider pb-4">
      <legend className="mt-4 mb-2 font-bold">Include sections</legend>
      <div className="grid grid-cols-3 gap-x-4 gap-y-2">
        {Object.values(ResumeSections).map((value) =>
          value !== "about" ? (
            <Tags.Checkbox
              key={value}
              name="section"
              value={value.toLowerCase()}
              label={capitalize(value)}
            />
          ) : null,
        )}
      </div>
    </fieldset>
  )
}

function TagFilter({ tags }: { tags: string[] }): JSX.Element | null {
  return (
    <fieldset className="border-b border-divider pb-4">
      <legend className="mt-4 mb-2 font-bold">Tags</legend>
      <div className="grid gap-x-4 gap-y-2">
        <Tags.List
          tags={tags}
          TagComponent={({ tag }) => (
            <Tags.Checkbox
              value={tag.toLowerCase()}
              name="tag"
              label={capitalize(tag)}
            />
          )}
        />
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
  )
}

function StyleFilter(): JSX.Element | null {
  const fonts = Object.values(ResumeFonts)
  const colors = Object.values(ResumePalettes)

  return (
    <fieldset className="border-b border-divider pb-4">
      <legend className="mt-4 mb-2 font-bold">Styling</legend>
      <div className="grid grid-cols-2 gap-4">
        <Select label="Font" name={"font"}>
          {fonts.map((font) => (
            <Select.Option value={font} key={font}>
              {font}
            </Select.Option>
          ))}
        </Select>
        <Select label="Color" name={"color"}>
          {colors.map((color) => (
            <Select.Option value={color} key={color}>
              {color}
            </Select.Option>
          ))}
        </Select>
      </div>
    </fieldset>
  )
}
