import { db } from "../db/client"
import { documents, transcripts } from "../db/schema/main"
import { fetchTranscript } from "youtube-transcript-plus"

export async function processDocument(sourceUrl: string, sourceType: "pdf" | "youtube") {
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

  let rawText = ""
  if (sourceType === "youtube") {
    console.log(`[service]: 3. Fetching YouTube transcript...`)
    rawText = await getYouTubeTranscript(sourceUrl)
  } else {
    console.log(`[service]: 3. PDF processing not yet implemented.`)
    rawText = "PDF text would go here."
  }

  if (!rawText || rawText.trim() === "") {
    throw new Error("Failed to extract text from the document.")
  }

  console.log(`[service]: 4. Saving raw text to 'transcripts' table...`)
  await db.insert(transcripts).values({
    documentId: document.id,
    fullText: rawText,
  })

  console.log(`[service]: 5. Transcript saved!`)

  return document
}

async function getYouTubeTranscript(url: string): Promise<string> {
  try {
    const transcript = await fetchTranscript(url)
    return transcript.map((segment: any) => segment.text).join(" ")
  } catch (error: any) {
    console.error("Error fetching YouTube transcript:", error)
    throw new Error(`Failed to fetch transcript: ${error.message}`)
  }
}