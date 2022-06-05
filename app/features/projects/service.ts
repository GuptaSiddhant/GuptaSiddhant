import { __IS_DEV__ } from "@gs/constants"
import {
  FirestoreCollection,
  readDocument,
} from "@gs/firebase/firestore.server"
import type { TeaserProps } from "@gs/types"

const collectionName = FirestoreCollection.Projects

export async function fetchProjectList(): Promise<TeaserProps[]> {
  return readDocument(FirestoreCollection.Info, collectionName).then(
    transformDataToTeaserList,
  )
}

function transformDataToTeaserList(data: Record<string, TeaserProps>) {
  return Object.values(data)
    .filter((teaser) => __IS_DEV__ || !teaser.draft)
    .map((teaser) => ({
      ...teaser,
      dateStart:
        typeof teaser.dateStart === "string"
          ? teaser.dateStart
          : (teaser.dateStart as any).toDate(),
    }))
    .sort((a, b) => (b.dateStart > a.dateStart ? 1 : -1))
}
