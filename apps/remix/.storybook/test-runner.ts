import type { TestRunnerConfig } from "@storybook/test-runner";
import { checkA11y, injectAxe } from "axe-playwright";

export default {
  preRender: async (page) => {
    await injectAxe(page);
  },
  postRender: async (page) => {
    await checkA11y(page, "#storybook-root", {
      detailedReport: true,
      detailedReportOptions: {
        html: true,
      },
    });
  },
} satisfies TestRunnerConfig;
