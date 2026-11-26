import {
  RiAdminFill as AdminIcon,
  RiDatabase2Fill as CacheIcon,
  RiEditBoxFill as EditorIcon,
  RiHardDrive2Fill as StorageIcon,
  RiListSettingsFill as LogsIcon,
  RiLogoutCircleRLine as LogoutIcon,
  RiSettings3Fill as SettingsIcon,
  RiTerminalWindowFill as GraphQLIcon,
} from "@remixicon/react";

import AdminRegistry from "./registry";
import type { AdminAction, AdminApp } from "./types";

export { AdminAction, AdminApp as AdminAppProps, AdminIcon };

export enum AdminAppId {
  Editor = "editor",
  Settings = "settings",
  Cache = "cache",
  Storage = "storage",
  GraphQL = "graphql",
  Logs = "logs",
}

export const adminRegistry = new AdminRegistry<AdminAppId>({
  adminBasePath: "/admin",
})
  .registerApp(AdminAppId.Editor, {
    title: "Editor",
    icon: <EditorIcon />,
  })
  .registerApp(AdminAppId.Settings, {
    title: "Settings",
    icon: <SettingsIcon />,
  })
  .registerApp(AdminAppId.Cache, {
    title: "Cache",
    icon: <CacheIcon />,
  })
  .registerApp(AdminAppId.Storage, {
    title: "Storage",
    icon: <StorageIcon />,
  })
  .registerApp(AdminAppId.GraphQL, {
    title: "GraphQL",
    icon: <GraphQLIcon />,
  })
  .registerApp(AdminAppId.Logs, {
    title: "Logs",
    icon: <LogsIcon />,
  })
  .registerAction({
    id: "logout",
    title: "Logout",
    icon: <LogoutIcon />,
    linkPath: "/logout",
  });
