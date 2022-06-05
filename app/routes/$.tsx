import { Caption, H1, Paragraph } from "@gs/components/Text"
import Section from "@gs/layouts/Section"

export default function Error404(): JSX.Element | null {
  return (
    <Section.Prose>
      <Caption>Error 404</Caption>
      <H1 className="text-error">Page not found</H1>
      <Paragraph className="text-tertiary">
        Oops! Looks like you tried to visit a page that does not exist.
      </Paragraph>
      <button
        className="w-max"
        onClick={() => typeof window !== "undefined" && window.history.go(-1)}
      >
        {"< Go back."}
      </button>
    </Section.Prose>
  )
}
