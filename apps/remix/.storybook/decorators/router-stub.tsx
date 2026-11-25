import { RemixBrowser } from "@remix-run/react";
import type { Decorator } from "@storybook/react";
import React from "react";

function RemixStub({ children }: { children: React.ReactNode }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const win = window as any;
  win.__remixManifest = {
    routes: {
      "routes/$": {
        id: "routes/$",
        path: "*",
      },
    },
  };
  win.__remixRouteModules = {
    "routes/$": {
      default: () => children,
    },
  };
  win.__remixContext = {
    state: {},
    future: {},
  };

  return <RemixBrowser />;
}

const remixStubDecorator: Decorator = (Story) => (
  <RemixStub>
    <Story />
  </RemixStub>
);

export default remixStubDecorator;
