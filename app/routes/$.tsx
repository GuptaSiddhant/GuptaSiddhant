import Section from "~/packages/components/Section"

export default function Error404(): JSX.Element | null {
  return (
    <Section.Error
      caption="Error 404"
      title="Page not found"
      description="Oops! Looks like you tried to visit a page that does not exist."
    />
  )
}
