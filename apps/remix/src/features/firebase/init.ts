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
  // rome-ignore lint/nursery/noVar: Global declaration
  var firebaseApp: App;
  // rome-ignore lint/nursery/noVar: Global declaration
  var firestore: Firestore;
}
