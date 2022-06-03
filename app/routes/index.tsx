import {
  readDocument,
  FirestoreCollection,
} from "@gs/firebase/firestore.server"
import HomeHeroSection from "~/features/home/HomeHeroSection"

export default function Index() {
  return (
    <>
      <HomeHeroSection />
    </>
  )
}

export async function loader() {
  const about = await readDocument(FirestoreCollection.Info, "about")

  return { about }
}
