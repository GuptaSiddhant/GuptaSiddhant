import { useGlobals } from "@storybook/addons";
import type { Decorator } from "@storybook/react";
import type {} from "@storybook/types";
import React from "react";

import getCSSForThemeName, {
  DEFAULT_THEME,
  ThemeName,
  getThemeFromThemeName,
} from "../../src/features/theme";

interface StorybookBackgrounds {
  default: string;
  values: { name: string; value: string }[];
  grid?: Partial<{
    cellSize: number;
    opacity: number;
    cellAmount: number;
    offsetX: number; // default is 0 if story has 'fullscreen' layout, 16 if layout is 'padded'
    offsetY: number;
  }>;
}

const getBgColor = (themeName: ThemeName) =>
  getThemeFromThemeName(themeName).bg.primary;

const Background = {
  Light: { name: "Light", value: getBgColor(ThemeName.Light) },
  Dark: { name: "Dark", value: getBgColor(ThemeName.Dark) },
} satisfies Record<string, StorybookBackgrounds["values"][0]>;

const themeDecorator: Decorator = (Story) => {
  const [args] = useGlobals();

  const backgroundValue: string = args?.backgrounds?.value || "";
  const themeName: ThemeName =
    backgroundValue === Background.Dark.value
      ? ThemeName.Dark
      : backgroundValue === Background.Light.value
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

export const backgrounds: StorybookBackgrounds = {
  default: Background.Dark.name,
  values: [Background.Light, Background.Dark],
};
