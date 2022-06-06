import { __IS_DEV__ } from "@gs/constants"
import {
  FirestoreCollection,
  getFirestoreCollection,
} from "@gs/firebase/firestore.server"
import type { TeaserProps } from "@gs/types"

const collectionName = FirestoreCollection.Projects

export async function fetchProjectsAll(limit = 10): Promise<TeaserProps[]> {
  const collection =
    (await getFirestoreCollection<TeaserProps>(collectionName)) || []

  return collection
    .filter((teaser) => __IS_DEV__ || !teaser.draft)
    .slice(0, limit)
  // .sort((a, b) => (b.dateStart > a.dateStart ? 1 : -1))
}
