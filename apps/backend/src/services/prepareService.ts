import { db } from "../db/client"
import { documents } from "../db/schema/main"

export async function createDocument(sourceUrl: string, sourceType: "pdf" | "youtube") {
  console.log(`[service]: 1. Creating document record...`)

  const newDocument = await db
    .insert(documents)
    .values({
      sourceUrl: sourceUrl,
      sourceType: sourceType,
      status: "processing",
    })
    .returning()

  const document = newDocument[0]
  console.log(`[service]: 2. Document record created with ID: ${document.id}`)
  
  return document
}