#! /usr/bin/env node
//  @ts-check

const { readEnvVariable } = require("./utils")

const serviceAccount = JSON.parse(
  readEnvVariable("FIREBASE_SERVICE_ACCOUNT_KEY"),
)

const { cert, initializeApp } = require("firebase-admin/app")
const firebase = initializeApp({
  credential: cert(serviceAccount),
  databaseURL: "https://guptasiddhant-com.firebaseio.com",
  storageBucket: "guptasiddhant-com.appspot.com",
})

// Storage

const { getStorage } = require("firebase-admin/storage")

// Firestore

const { getFirestore, Timestamp } = require("firebase-admin/firestore")
const firestore = getFirestore()

/**
 * @param {string} collectionPath
 */
const getFirestoreCollection = async (collectionPath) => {
  return await firestore
    .collection(collectionPath)
    .withConverter({ toFirestore, fromFirestore })
    .get()
    .then((snapshot) => snapshot.docs.map((doc) => doc.data()))
}

/**
 * @param {string} collectionPath
 * @param {string} documentPath
 * @param {{ [x: string]: any; }} data
 */
const setFirestoreDocument = async (collectionPath, documentPath, data) => {
  return await getFirestore()
    .collection(collectionPath)
    .withConverter({ toFirestore, fromFirestore })
    .doc(documentPath)
    .set(data, { merge: true })
}

module.exports = {
  firebase,
  firestore,
  setFirestoreDocument,
  getFirestoreCollection,
  getStorage,
}

// Helpers

function toFirestore(data) {
  const modifiedDates = Object.entries(data).reduce((acc, [key, value]) => {
    if (!key.toLowerCase().includes("date") || !value) return acc
    return { ...acc, [key]: Timestamp.fromDate(new Date(value)) }
  }, {})
  return { ...data, ...modifiedDates }
}

function fromFirestore(snapshot) {
  const data = snapshot.data()

  const modifiedDates = Object.entries(data).reduce((acc, [key, value]) => {
    if (!key.toLowerCase().includes("date") || !value) return acc
    return { ...acc, [key]: transformFirestoreTimestampToFormattedDate(value) }
  }, {})
  return { ...data, ...modifiedDates }
}

function transformFirestoreTimestampToFormattedDate(date) {
  if (!date) return undefined
  return (
    typeof date === "string" ? new Date(date) : date.toDate()
  ).toISOString()
}
