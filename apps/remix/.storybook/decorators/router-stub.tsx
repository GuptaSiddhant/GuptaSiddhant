import type { Decorator } from "@storybook/react";
import { MemoryRouter } from "react-router";

const routerStubDecorator: Decorator = (Story) => (
  <MemoryRouter>
    <Story />
  </MemoryRouter>
);

export default routerStubDecorator;
