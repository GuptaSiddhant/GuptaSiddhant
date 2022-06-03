import {
  readDocument,
  FirestoreCollection,
} from "@gs/firebase/firestore.server"
import { useLoaderData } from "@remix-run/react"
import HomeHeroSection from "~/features/home/HomeHeroSection"

export default function Index() {
  const data = useLoaderData()
  console.log(data)

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
