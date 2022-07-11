import { Newline, Text } from "ink"

import TextTable from "../components/TextTable"
import { about, contacts } from "../helpers/about"
import { useAboutQuery } from "../helpers/queries"

export default function About(): JSX.Element {
  const { data: aboutInfo } = useAboutQuery()
  const { techStack, currentCompany } = aboutInfo || {}

  return (
    <>
      <Text>
        {about}
        {currentCompany ? (
          <>
            <Newline />
            <Text>Currently applying my skills at {currentCompany.name}.</Text>
            <Newline />
          </>
        ) : null}
        {techStack ? (
          <>
            <Newline />
            <Text bold>My Stack</Text>
            <Newline />
            <Text>{techStack?.join(", ")}</Text>
            <Newline />
          </>
        ) : null}
      </Text>
      <TextTable
        items={contacts.map(({ label, value, url }) => ({
          key: label,
          value: value || url || "",
        }))}
      />
    </>
  )
}
