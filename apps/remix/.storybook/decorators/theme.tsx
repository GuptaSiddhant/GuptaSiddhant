import { useGlobals } from "@storybook/addons";
import type { Decorator } from "@storybook/react";
import React from "react";

import getCSSForThemeName, {
  DEFAULT_THEME,
  ThemeName,
  getThemeFromThemeName,
} from "../../src/features/theme";

const Background = {
  Light: getThemeFromThemeName(ThemeName.Light).bg.primary,
  Dark: getThemeFromThemeName(ThemeName.Dark).bg.primary,
} as const satisfies Record<string, string>;

const backgroundValues = [
  {
    name: "Light",
    value: Background.Light,
  },
  {
    name: "Dark",
    value: Background.Dark,
  },
];

export const backgrounds = {
  default: Background.Dark,
  values: backgroundValues,
};

const themeDecorator: Decorator = (Story) => {
  const [args] = useGlobals();

  const backgroundValue = args?.backgrounds?.value || "";
  const themeName: ThemeName =
    backgroundValue === Background.Dark
      ? ThemeName.Dark
      : backgroundValue === Background.Light
      ? ThemeName.Light
      : DEFAULT_THEME;

  return (
    <>
      <Story />
      <style>{getCSSForThemeName(themeName)}</style>
    </>
  );
};

export default themeDecorator;
