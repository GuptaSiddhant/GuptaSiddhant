import { useLocation } from "@remix-run/react";
import { getAnalytics, logEvent } from "firebase/analytics";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { useEffect } from "react";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDtuA2g8c2Wy3HW-XxSjeMtaeV4EfmpNUk",
  authDomain: "guptasiddhant-com.firebaseapp.com",
  databaseURL: "https://guptasiddhant-com.firebaseio.com",
  projectId: "guptasiddhant-com",
  storageBucket: "guptasiddhant-com.appspot.com",
  messagingSenderId: "693972243954",
  appId: "1:693972243954:web:9cabb4774c7f9e6196876b",
  measurementId: "G-SVFRY7WXKB",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export function logPageViewEvent(
  path: string,
  title?: string,
  location?: string,
) {
  return logEvent(analytics, "page_view", {
    page_title: title,
    page_path: path,
    page_location: location,
  });
}

export function useLogPageViewEvent() {
  const { pathname } = useLocation();

  useEffect(() => {
    logPageViewEvent(pathname);
  }, [pathname]);
}
