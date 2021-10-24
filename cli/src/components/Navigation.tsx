import { Tab, Tabs } from "../ink/Tabs";
import routes, { useRouter } from "../routes";
import Divider from "./Divider";

export default function Navigation(): JSX.Element {
  const [activeRoute, setActiveRoute] = useRouter();

  const handleChange = (title: string) => {
    const path = routes.find((route) => route.title === title)?.path;
    if (path) setActiveRoute(path);
  };

  const tabIndex = routes.findIndex((route) => route.path === activeRoute) || 0;

  return (
    <>
      <Tabs tabIndex={tabIndex} onChange={handleChange} width="100%">
        {routes.map(({ path, title }) => (
          <Tab key={path} name={title} />
        ))}
      </Tabs>
      <Divider />
    </>
  );
}
