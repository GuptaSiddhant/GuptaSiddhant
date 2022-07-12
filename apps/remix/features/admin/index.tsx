import AdminIcon from "remixicon-react/AdminFillIcon"
import CacheIcon from "remixicon-react/Database2FillIcon"
import EditorIcon from "remixicon-react/EditBoxFillIcon"
import StorageIcon from "remixicon-react/HardDrive2FillIcon"
import SettingsIcon from "remixicon-react/Settings3FillIcon"
import invariant from "tiny-invariant"

import type { AdminAppProps } from "./types"

export { AdminIcon }

export enum AdminAppId {
  Editor = "editor",
  Settings = "settings",
  Cache = "cache",
  Storage = "storage",
}

export default class AdminAppRegistry {
  static #registry: Record<
    AdminAppId,
    {
      name: string
      icon: JSX.Element | null
    }
  > = {
    [AdminAppId.Editor]: {
      name: "Editor",
      icon: <EditorIcon />,
    },
    [AdminAppId.Settings]: {
      name: "Settings",
      icon: <SettingsIcon />,
    },
    [AdminAppId.Cache]: {
      name: "Cache",
      icon: <CacheIcon />,
    },
    [AdminAppId.Storage]: {
      name: "Storage",
      icon: <StorageIcon />,
    },
  }

  static get(id: AdminAppId): AdminAppProps {
    const app = this.#registry[id]
    invariant(app, `Admin app with id '${id}' not found in registry.`)

    return { ...app, id, to: `/admin/${id}/` }
  }

  static get registry() {
    const apps: AdminAppProps[] = []

    for (const id in this.#registry) {
      apps.push(this.get(id as AdminAppId))
    }

    return apps.sort((a, b) => a.name.localeCompare(b.name))
  }
}
