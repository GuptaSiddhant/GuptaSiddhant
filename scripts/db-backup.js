#! /usr/bin/env node
// @ts-check

const os = require("os")
const { join } = require("path")
const { writeFileSync, unlinkSync } = require("fs")
const { getFirestoreCollection, getStorage } = require("./firebase")

const backupDir = join("backup")
const firestoreCollections = [
  "users",
  "info",
  "projects",
  "blog",
  "testimonies",
  "education",
  "career",
]

backup().catch((e) => console.error(e))

async function backup() {
  const backupData = {}

  for (const collection of firestoreCollections) {
    const data = await getFirestoreCollection(collection)
    backupData[collection] = data
  }

  const backupFilePath = join(
    backupDir,
    `backup-${new Date().toISOString()}.json`,
  )

  return await uploadFileInFirebaseStorage(
    JSON.stringify(backupData, null, 2),
    backupFilePath,
  )
}

/**
 *
 * @param {File | string} file
 * @param {string} destination
 */
async function uploadFileInFirebaseStorage(file, destination) {
  const tempFilePath = join(os.tmpdir(), Math.random().toString())
  const data =
    typeof file === "string" ? file : new Uint8Array(await file.arrayBuffer())
  writeFileSync(tempFilePath, data)
  await getStorage().bucket().upload(tempFilePath, { destination })
  unlinkSync(tempFilePath)
}
