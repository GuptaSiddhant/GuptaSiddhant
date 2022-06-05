import { __IS_DEV__ } from "@gs/constants"
import {
  FirestoreCollection,
  readDocument,
} from "@gs/firebase/firestore.server"
import type { TeaserProps } from "@gs/types"

const collectionName = FirestoreCollection.Blog

export async function fetchBlogPostList(): Promise<TeaserProps[]> {
  return readDocument(FirestoreCollection.Info, collectionName).then(
    transformDataToTeaserList,
  )
}

function transformDataToTeaserList(data: Record<string, TeaserProps>) {
  return Object.values(data)
    .filter((teaser) => __IS_DEV__ || !teaser.draft)
    .map((teaser) => ({
      ...teaser,
      date:
        typeof teaser.date === "string"
          ? teaser.date
          : (teaser.date as any).toDate(),
    }))
    .sort((a, b) => (b.date > a.date ? 1 : -1))
}
