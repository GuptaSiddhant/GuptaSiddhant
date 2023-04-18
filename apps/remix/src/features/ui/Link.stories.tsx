import type { Meta, StoryObj } from "@storybook/react";

import AnchorLink from "./Link";

const component = AnchorLink;
type ComponentType = typeof component;
type Story = StoryObj<ComponentType>;

export default {
  title: "UI / Link",
  component,
  args: {},
} satisfies Meta<ComponentType>;

export const Internal: Story = {
  args: {
    href: "#",
    children: "Internal Link",
  },
};

export const External: Story = {
  args: {
    href: "https://example.com",
    children: "External Link",
  },
};

export const ExternalWithIcon: Story = {
  args: {
    enableIcon: true,
    href: "https://example.com",
    children: "External Link",
  },
};
