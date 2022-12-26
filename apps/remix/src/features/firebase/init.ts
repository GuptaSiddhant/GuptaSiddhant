import { type App, cert, initializeApp } from "firebase-admin/app";
import { type Firestore, getFirestore } from "firebase-admin/firestore";

import { googleServiceAccount } from "./credentials";

export function initFirebase() {
  const serviceAccount = googleServiceAccount();

  global.firebaseApp ||
    (global.firebaseApp = initializeApp({
      credential: cert(serviceAccount),
      databaseURL: "https://guptasiddhant-com.firebaseio.com",
      storageBucket: "guptasiddhant-com.appspot.com",
    }));

  global.firestore || (global.firestore = getFirestore(global.firebaseApp));
  global.firestore || firestore.settings({ ignoreUndefinedProperties: true });
}

declare global {
  var firebaseApp: App;
  var firestore: Firestore;
}
