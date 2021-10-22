import React from "react";
import { Box } from "ink";
import { ErrorText } from "../components/misc";
import { Route, useRouter } from "../Router";

import Education from "./Education";
import Career from "./Career";
import Projects from "./Projects";
import About from "./About";

function getPageComponent(route: Route) {
  switch (route) {
    case "Education":
      return Education;
    case "Career":
      return Career;
    case "Projects":
      return Projects;
    case "About":
      return About;
    default:
      return ErrorText;
  }
}

export default function Page(): JSX.Element {
  const [activeRoute] = useRouter();
  const Component = getPageComponent(activeRoute);

  return (
    <Box marginTop={1}>
      <Component />
    </Box>
  );
}
