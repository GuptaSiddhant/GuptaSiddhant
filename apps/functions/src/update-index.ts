import * as functions from "firebase-functions"
import axios from "axios"

import {
  db,
  FieldValue,
  type DocumentData,
  transformFirestoreTimestampToFormattedDate,
} from "./firestore"

enum Model {
  Projects = "projects",
  Blog = "blog",
  Education = "education",
  Career = "career",
}

export const updateIndex = functions
  .region("europe-west1")
  .firestore.document(`{collectionId}/{docId}`)
  .onWrite(async (change, context) => {
    const collectionId = String(context.params.collectionId) as Model
    if (!Object.values(Model).includes(collectionId)) return false

    const docId = String(context.params.docId)
    const newDocument = change.after.data()
    const newIndexData = transformFirestoreDataToIndexItem(
      newDocument,
      collectionId,
      docId,
    )

    const indexDocRef = db.collection("index").doc(collectionId)

    await indexDocRef.set(
      { [docId]: newIndexData ?? FieldValue.delete() },
      { merge: true },
    )

    await axios.get(
      "https://guptasiddhant.com/cache?key=database/index/" + collectionId,
    )

    return
  })

function transformFirestoreDataToIndexItem(
  data: DocumentData | undefined,
  model: Model,
  docId: string,
): IndexItemProps | undefined {
  if (!data) return undefined

  const title =
    model === Model.Education
      ? [data.degree, data.field].filter(Boolean).join(" - ")
      : model === Model.Career
      ? data.position
      : data.title

  const subtitle =
    model === Model.Education
      ? [data.school, data.location].filter(Boolean).join(", ")
      : model === Model.Career
      ? [data.company, data.location].filter(Boolean).join(", ")
      : data.subtitle

  const linkUrl =
    model === Model.Education || model === Model.Career
      ? `/about/${docId}/`
      : `/${model}/${docId}/`

  const duration = generateDurationString(data)
  const date = transformFirestoreTimestampToFormattedDate(
    data.date ||
      data.dateStart ||
      data.startDate ||
      data.dateEnd ||
      data.endDate,
  )

  return {
    id: docId || data.id,
    model,
    title,
    subtitle,
    linkUrl,

    date,
    icon: data.icon ?? undefined,
    cover: (data.cover || data.gallery?.[0]?.url) ?? undefined,
    tags: data.tags || [],
    description: data.description ?? undefined,
    links: data.links || [],
    duration,

    draft: data.draft ?? true,
    featured: data.featured ?? false,
  }
}

interface IndexItemProps {
  id: string
  title: string
  model: string
  linkUrl: string

  subtitle?: string
  description?: string
  date?: string
  icon?: string
  cover?: string
  tags?: string[]
  links?: { url: string; alt?: string }[]
  duration?: string

  draft?: boolean
  featured?: boolean
}

export function generateDurationString({
  startDate,
  endDate,
  dateEnd,
  dateStart,
}: any): string | undefined {
  if (!startDate && !endDate && !dateStart && !dateEnd) return undefined

  const formatDate = (date: any) => {
    const isoDate = transformFirestoreTimestampToFormattedDate(date)
    if (!isoDate) return undefined
    return new Date(isoDate).toLocaleDateString(undefined, {
      month: "long",
      year: "numeric",
    })
  }

  const start =
    startDate || dateStart ? formatDate(startDate || dateStart) : undefined
  const end = endDate || dateEnd ? formatDate(endDate || dateEnd) : "Present"

  return [start, end].filter(Boolean).join(" - ")
}
