import React from "react";
import { Tab, Tabs } from "./Tabs";

import routes, { useRouter } from "../Router";

export default function Navigation(): JSX.Element {
  const [activeRoute, setActiveRoute] = useRouter();

  const handleChange = (title: string) => {
    const path = routes.find((route) => route.title === title)?.path;
    if (path) setActiveRoute(path);
  };

  return (
    <Tabs defaultValue={activeRoute} onChange={handleChange} width="100%">
      {routes.map(({ path, title }) => (
        <Tab name={title} key={path} />
      ))}
    </Tabs>
  );
}
