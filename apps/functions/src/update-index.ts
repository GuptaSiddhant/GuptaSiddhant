import * as functions from "firebase-functions"
import { db, FieldValue, type DocumentData } from "./firestore"

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

    return await indexDocRef.set(
      { [docId]: newIndexData ?? FieldValue.delete() },
      { merge: true },
    )
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

  return {
    id: docId || data.id,
    model,
    title,
    subtitle,
    linkUrl,

    date:
      data.date ||
      data.dateStart ||
      data.startDate ||
      data.dateEnd ||
      data.endDate ||
      undefined,
    icon: data.icon ?? undefined,
    cover: (data.cover || data.gallery?.[0]?.url) ?? undefined,
    tags: data.tags || [],
    description: data.description ?? undefined,

    draft: data.draft ?? true,
    featured: data.featured ?? false,
  }
}

interface IndexItemProps {
  id: string
  model: Model
  title: string
  subtitle?: string
  linkUrl?: string

  date?: string
  icon?: string
  cover?: string
  tags?: string[]
  description?: string

  draft?: boolean
  featured?: boolean
}
