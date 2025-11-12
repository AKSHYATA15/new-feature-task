import { db } from "../db/client"
import { documents, transcripts, summaries, faqs, mcqs, roadmaps, roadmapNodes } from "../db/schema/main"
import { fetchTranscript } from "youtube-transcript-plus"
import * as geminiService from "./geminiService"
import { decode } from "html-entities"

export async function getYouTubeTranscript(url: string): Promise<string> {
  try {
    const transcript = await fetchTranscript(url)
    return transcript
      .map((segment: any) => decode(decode(segment.text))) 
      .join(" ")
  } catch (error: any) {
    console.error("Error fetching YouTube transcript:", error)
    throw new Error(`Failed to fetch transcript: ${error.message}`)
  }
}