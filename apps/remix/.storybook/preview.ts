import type { Preview } from "@storybook/react";

import routerStubDecorator from "./decorators/router-stub";
import themeDecorator, { backgrounds } from "./decorators/theme";
import "./tailwind.generated.css";

export default {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    backgrounds,
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    layout: "fullscreen",
  },

  decorators: [routerStubDecorator, themeDecorator],
} satisfies Preview;
