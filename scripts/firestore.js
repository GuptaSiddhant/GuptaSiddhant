#! /usr/bin/env node
//  @ts-check

const serviceAccount = JSON.parse(
  readEnvVariable("FIREBASE_SERVICE_ACCOUNT_KEY"),
)

const { cert, initializeApp } = require("firebase-admin/app")
const firebase = initializeApp({
  credential: cert(serviceAccount),
  databaseURL: "https://guptasiddhant-com.firebaseio.com",
  storageBucket: "guptasiddhant-com.appspot.com",
})

const { getFirestore } = require("firebase-admin/firestore")

/**
 * @param {string} collectionPath
 * @param {string} documentPath
 * @param {{ [x: string]: any; }} data
 */
const setFirestoreDocument = async (collectionPath, documentPath, data) => {
  return await getFirestore()
    .collection(collectionPath)
    .doc(documentPath)
    .set(data, { merge: true })
}

module.exports = { setFirestoreDocument }

/**
 * @param {string} key
 * @param {string=} fallback
 */
function readEnvVariable(key, fallback) {
  const val = require("fs")
    .readFileSync(".env", {
      encoding: "utf-8",
    })
    ?.split(require("os").EOL)
    ?.find((line) => line.startsWith(key))
    ?.trim()
    ?.split("=")
    ?.slice(1)
    ?.join("=")
    ?.slice(1, -1)
    ?.trim()

  if (val) return val
  if (fallback) return fallback
  throw new Error(`Env ${key} not found`)
}
