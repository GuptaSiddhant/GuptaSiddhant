import type { Preview } from "@storybook/react";

import remixStubDecorator from "./decorators/remix-stub";
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

  decorators: [remixStubDecorator, themeDecorator],
} satisfies Preview;
