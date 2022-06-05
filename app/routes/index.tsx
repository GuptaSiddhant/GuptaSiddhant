import {
  readDocument,
  FirestoreCollection,
} from "@gs/firebase/firestore.server"

import { json } from "@remix-run/server-runtime"
import { type HomeLoaderData, type About } from "~/features/home"
import HomeHeroSection from "~/features/home/HomeHeroSection"

export default function Index() {
  return (
    <>
      <HomeHeroSection />
    </>
  )
}

export async function loader() {
  const about = await readDocument<About>(FirestoreCollection.Info, "about")

  return json<HomeLoaderData>({ about })
}
