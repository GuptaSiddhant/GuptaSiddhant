import React from "react";
import { Tab, Tabs } from "./Tabs";

import routes, { Route, useRouter } from "../Router";

export default function Navigation(): JSX.Element {
  const [activeRoute, setActiveRoute] = useRouter();

  return (
    <Tabs
      defaultValue={activeRoute}
      onChange={(name: Route) => setActiveRoute(name)}
      width="100%"
    >
      {routes.map((value) => (
        <Tab name={value} key={value} children={value} />
      ))}
    </Tabs>
  );
}
