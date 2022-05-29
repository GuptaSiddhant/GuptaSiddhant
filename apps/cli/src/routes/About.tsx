import { Newline, Text } from "ink";

import { contacts, about, skills } from "../helpers/about";
import TextTable from "../components/TextTable";

export default function About(): JSX.Element {
  return (
    <>
      <Text>
        {about}
        <Newline />
        <Text bold>SKILLS</Text>
        <TextTable
          vertical
          items={skills.map(({ type, value }) => ({ key: type, value }))}
        />
      </Text>
      <TextTable
        items={contacts.map(({ label, value, url }) => ({
          key: label,
          value: value || url || "",
        }))}
      />
    </>
  );
}
