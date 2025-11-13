import { db } from "../db/client"
import { documents, transcripts } from "../db/schema/main"

export async function createYouTubeDocument(sourceUrl: string) {
  console.log(`[service]: Creating YouTube document record...`)
  const newDocument = await db
    .insert(documents)
    .values({
      sourceUrl: sourceUrl,
      sourceType: "youtube",
      status: "processing",
    })
    .returning()
  
  return newDocument[0]
}

export async function createPdfDocument(rawText: string, title: string) {
  console.log(`[service]: Creating PDF document record and transcript...`)
  
  const newDocument = await db
    .insert(documents)
    .values({
      title: title,
      sourceType: "pdf",
      sourceUrl: "",
      status: "processing",
    })
    .returning()

  const document = newDocument[0]

  await db.insert(transcripts).values({
    documentId: document.id,
    fullText: rawText,
  })
  
  console.log(`[service]: PDF document and transcript saved!`)
  return document
}