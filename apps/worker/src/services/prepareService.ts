import { db } from "../db/client"
import { documents, transcripts, summaries, faqs, mcqs, roadmaps, roadmapNodes, transcript_segments } from "../db/schema/main"
import { fetchTranscript } from "youtube-transcript-plus"
import * as geminiService from "./geminiService"
import { decode } from "html-entities"
import { v4 as uuidv4 } from "uuid"

export async function getYouTubeTranscript(url: string): Promise<string> {
  try {
    const transcript = await fetchTranscript(url, {
      lang: "en" 
    })
    return transcript
      .map((segment: any) => decode(decode(segment.text))) 
      .join(" ")
  } catch (error: any) {
    console.error("Error fetching YouTube transcript:", error)
    throw new Error(`Failed to fetch transcript: ${error.message}`)
  }
}

export async function saveYouTubeTranscriptSegments(url: string, documentId: string) {
  try {
    console.log(`[service]: Fetching segments for UI...`)
    const segments = await fetchTranscript(url, {
      lang: "en"
    })

    const segmentsToInsert = segments.map(seg => ({
      documentId: documentId,
      text: decode(decode(seg.text)),
      startTime: Math.floor(seg.offset / 1000),
      endTime: Math.floor((seg.offset + (seg.duration || 0)) / 1000)
    }))

    await db.insert(transcript_segments).values(segmentsToInsert)
    console.log(`[service]: Transcript SEGMENTS saved!`)
    
  } catch (error: any) {
    console.error("Error saving transcript segments:", error)
  }
}