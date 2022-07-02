import {
  type RemoteConfigTemplate,
  getRemoteConfig,
} from "firebase-admin/remote-config"

// Keys

export enum RemoteConfigKey {
  EnableSearch = "enableSearch",
}

export async function getRemoteConfigTemplate(): Promise<RemoteConfigTemplate> {
  return getRemoteConfig().getTemplate()
}

export async function setRemoteConfigTemplate(
  template: RemoteConfigTemplate,
): Promise<RemoteConfigTemplate> {
  try {
    const config = getRemoteConfig()
    await config.validateTemplate(template)
    return await config.publishTemplate(template)
  } catch (error) {
    throw new Error(`Could not set the remote-config: ${error}`)
  }
}

export async function getAllRemoteConfigKeys(): Promise<RemoteConfigKey[]> {
  const template = await getRemoteConfigTemplate()
  if (!template) return []

  return (Object.keys(template.parameters) as RemoteConfigKey[]).filter(
    (key) => {
      const defaultValue = template.parameters[key].defaultValue
      if (!defaultValue) return false
      if (!("value" in defaultValue)) return false
      return Boolean(defaultValue.value)
    },
  )
}

// Exports

export { RemoteConfigTemplate }
