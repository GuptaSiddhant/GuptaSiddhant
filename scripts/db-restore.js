#! /usr/bin/env node
// @ts-check

const { join } = require("path")
const { readFileSync } = require("fs")
const { setFirestoreDocument } = require("./firebase")

const backupDir = join("backup")

restore().catch((e) => console.error(e))

async function restore() {
  const backupFilePath = join(backupDir, "backup.json")
  /** @type {Record<string, any[]>} */
  const backupData = JSON.parse(
    readFileSync(backupFilePath, { encoding: "utf8" }),
  )

  const promises = Object.keys(backupData)
    .map((collection) =>
      backupData[collection].map((doc) =>
        setFirestoreDocument(collection, doc.id, doc),
      ),
    )
    .flat()

  return Promise.all(promises)
}
