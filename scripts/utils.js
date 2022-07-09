// @ts-check

const { readFileSync, existsSync } = require("fs")

/**
 * @param {string} key
 * @param {string=} fallback
 * @return {string}
 */
function readEnvVariable(key, fallback = undefined) {
  const envFilePaths = [
    ".env",
    ".env.local",
    ".env.development",
    ".env.production",
    ".env.test",
  ]

  try {
    const envFilePath = envFilePaths.find(existsSync)
    if (!envFilePath) throw new Error(`Env file not found`)
    const envFile = readFileSync(envFilePath, { encoding: "utf-8" })

    const envLine = envFile
      .split(require("os").EOL)
      .find((line) => line.startsWith(key))
      ?.trim()
    if (!envLine) throw new Error(`Env ${key} not found`)

    const val = envLine.split("=").slice(1).join("=").slice(1, -1).trim()
    if (!val) new Error(`Env value for ${key} not found`)

    return val
  } catch (e) {
    console.error(e)
    if (fallback) return fallback
    throw e
  }
}

module.exports = { readEnvVariable }
