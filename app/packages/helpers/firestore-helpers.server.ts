import type {
  DocumentData,
  DocumentSnapshot,
  Timestamp,
} from "firebase-admin/firestore"

import { getFirebaseStorageFileUrl } from "~/packages/service/storage.server"
import type { Gallery } from "~/packages/types"

export interface BaseData {
  date?: Timestamp
  dateStart?: Timestamp
  dateEnd?: Timestamp
  icon?: string
  gallery?: Gallery
  content?: string
}

export async function docTransformer<T extends DocumentData & BaseData>(
  doc?: DocumentSnapshot<T>,
  transformContent?: boolean,
): Promise<T> {
  if (!doc?.exists) throw new Error(`FirestoreDocument does not exist.`)

  const data = doc.data()
  if (!data) throw new Error(`FirestoreDocument is empty.`)

  const { icon, gallery, content } = await convertAllStorageFilesToUrls(
    data,
    !!transformContent,
  )

  return {
    id: doc.id,
    ...data,
    date: data?.date?.toDate?.()?.toISOString(),
    dateStart: data?.dateStart?.toDate?.()?.toISOString(),
    dateEnd: data?.dateEnd?.toDate?.()?.toISOString(),
    gallery,
    icon,
    content,
  }
}

async function convertAllStorageFilesToUrls(
  data: BaseData,
  transformContent: boolean,
) {
  const iconPromise = data.icon
    ? getFirebaseStorageFileUrl(data.icon)
    : undefined
  const galleryPromise = Promise.all(
    (data?.gallery || []).map(async (i) => ({
      ...i,
      url: await getFirebaseStorageFileUrl(i.url),
    })),
  )
  const contentPromise =
    transformContent && data.content
      ? convertImageLinksInText(data.content)
      : undefined

  const [icon, gallery, content] = await Promise.all([
    iconPromise,
    galleryPromise,
    contentPromise,
  ])

  return { icon, gallery, content }
}

async function convertImageLinksInText(content: string) {
  const markdownImageRegex = /!\[[^\]]*\]\([^)]*\)?\)/g
  const imageLinks =
    content
      .match(markdownImageRegex)
      ?.map(
        (markdown) => markdown.split("](")[1].split(")")[0].split(" ")[0],
      ) || []

  const imageUrls = await Promise.all(
    imageLinks.map(async (link) => ({
      url: await getFirebaseStorageFileUrl(link),
      link,
    })),
  )

  return imageUrls.reduce(
    (acc, { link, url }) => acc.replace(link, url || link),
    content,
  )
}
