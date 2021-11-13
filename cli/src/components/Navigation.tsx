import { Box } from "ink";
import { Tab, Tabs } from "./Tabs";
import routes, { useRouter } from "../routes";
import { PADDING_X } from "../helpers/constants";

export default function Navigation(): JSX.Element {
  const [activeRoute, setActiveRoute] = useRouter();

  const handleChange = (title: string) => {
    const path = routes.find((route) => route.title === title)?.path;
    if (path) setActiveRoute(path);
  };

  const tabIndex = routes.findIndex((route) => route.path === activeRoute) || 0;

  return (
    <Box paddingX={PADDING_X - 1} flexDirection="column">
      <Tabs tabIndex={tabIndex} onChange={handleChange} width="100%">
        {routes.map(({ path, title }) => (
          <Tab key={path} name={title} />
        ))}
      </Tabs>
    </Box>
  );
}
