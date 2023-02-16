import { useFetcher } from "@remix-run/react";
import DarkModeIcon from "remixicon-react/MoonFillIcon";
import LightModeIcon from "remixicon-react/SunFillIcon";

import useWindowStore from "@gs/hooks/useWindowStore";
import Action from "@gs/ui/Action";

import { type ThemeName } from ".";

export default function ThemeToggleButton({
  themeName,
}: {
  themeName: ThemeName;
}) {
  return (
    <Action.Form
      role={"presentation"}
      action="/theme.css"
      method="post"
      title="Toggle dark mode"
      body={{ theme: "toggle" }}
      reloadDocument
    >
      <ThemeIcon themeName={themeName} />
    </Action.Form>
  );
}

export function ThemeIcon({ themeName }: { themeName: ThemeName }) {
  return themeName === "light" ? <DarkModeIcon /> : <LightModeIcon />;
}

export function useToggleTheme() {
  const { submit, type } = useFetcher();
  const originPath = useWindowStore(
    "load",
    () => window.location.href,
    () => "",
  );

  if (type === "done") {
    window.location.replace(originPath);
  }

  return () => {
    submit(
      { theme: "toggle", originPath },
      { action: "/theme.css", method: "post" },
    );
  };
}
