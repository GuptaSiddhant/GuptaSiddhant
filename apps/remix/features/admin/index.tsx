import AdminRegistry, {
  type AdminAction,
  type AdminApp,
} from "@gs/admin/registry"
import AdminIcon from "remixicon-react/AdminFillIcon"
import CacheIcon from "remixicon-react/Database2FillIcon"
import EditorIcon from "remixicon-react/EditBoxFillIcon"
import StorageIcon from "remixicon-react/HardDrive2FillIcon"
import LogoutIcon from "remixicon-react/LogoutCircleRLineIcon"
import SettingsIcon from "remixicon-react/Settings3FillIcon"

export { AdminAction, AdminApp as AdminAppProps, AdminIcon }

export enum AdminAppId {
  Editor = "editor",
  Settings = "settings",
  Cache = "cache",
  Storage = "storage",
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
  .registerAction({
    id: "logout",
    title: "Logout",
    icon: <LogoutIcon />,
    linkPath: "/logout",
  })
