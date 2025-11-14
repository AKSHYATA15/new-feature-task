import "dotenv/config"
import { Worker } from "bullmq"
import IORedis from "ioredis"
import { db } from "./db/client"
import { documents, transcripts, summaries, faqs, mcqs, roadmaps, roadmapNodes , transcript_segments } from "./db/schema/main"
import { eq } from "drizzle-orm"
import * as geminiService from "./services/geminiService"
import { getYouTubeTranscript, saveYouTubeTranscriptSegments } from "./services/prepareService" 

if (!process.env.REDIS_URL) {
  throw new Error("REDIS_URL is not set in .env file")
}

const connection = new IORedis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null,
  tls: {
    rejectUnauthorized: false
  }
})

const processor = async (job: any) => {
  console.log(`[worker]: Received job for document ID: ${job.data.documentId}`)
  const { documentId, sourceUrl, sourceType } = job.data

  try {
    let rawText : string 
    if (sourceType === "youtube") {
      console.log(`[worker]: 1. Fetching YouTube transcript...`)

      rawText = await getYouTubeTranscript(sourceUrl)
      await db.insert(transcripts).values({ documentId, fullText: rawText })

      console.log(`[worker]: 2. Transcript saved!`)
      saveYouTubeTranscriptSegments(sourceUrl, documentId)

    } else if (sourceType === "pdf") {
      console.log(`[worker]: 1. PDF text already processed. Fetching...`)

      const result = await db.select()
        .from(transcripts)
        .where(eq(transcripts.documentId, documentId))
      
      if (result.length === 0) {
        throw new Error(`No transcript found for PDF document ID: ${documentId}`)
      }
      if (result[0].fullText === null) {
        throw new Error(`Transcript for PDF document ID: ${documentId} has null fullText`)
      }
      rawText = result[0].fullText
      console.log(`[worker]: 2. Transcript fetched!`)
      
    } else {
      throw new Error(`Unknown sourceType: ${sourceType}`)
    }

    const summaryText = await geminiService.generateSummary(rawText)
    await db.insert(summaries).values({ documentId, text: summaryText, modelName: "gemini-2.0-flash" })
    console.log(`[worker]: 3. Summary saved!`)

    const faqList = await geminiService.generateFAQs(rawText)
  
    const faqsToInsert = faqList.map((faq: { question: string, answer: string, explanation: string }) => ({
        documentId: documentId,
        question: faq.question,
        answer: faq.answer,
        explanation: faq.explanation, 
    }))

    await db.insert(faqs).values(faqsToInsert)
    console.log(`[worker]: 4. FAQs saved!`)

    const mcqList = await geminiService.generateMCQs(rawText)
    const mcqsToInsert = mcqList.map((mcq: {
    question: string,
    options: any, 
    correctOption: string,
    explanation: string
    }) => ({
    documentId: documentId,
    question: mcq.question,
    options: mcq.options,
    correctOption: mcq.correctOption,
    explanation: mcq.explanation,
    }))

    await db.insert(mcqs).values(mcqsToInsert)
    console.log(`[worker]: 5. MCQs saved!`)

    const roadmapData = await geminiService.generateRoadmap(rawText)

    const newRoadmap = await db.insert(roadmaps).values({
      documentId: documentId,
    }).returning({ id: roadmaps.id })
    
    const roadmapId = newRoadmap[0].id

    const nodesToInsert = roadmapData.nodes.map((node: {
      id: string,
      data: { label: string },
      position: any,
      style: any
    }) => ({
      id: node.id,
      roadmapId: roadmapId,
      parentId: roadmapData.edges.find(edge => edge.target === node.id)?.source || null,
      label: node.data.label,
      position: node.position,
      style: node.style,
    }))

    await db.insert(roadmapNodes).values(nodesToInsert)
    console.log(`[worker]: 6. Roadmap saved!`)

    await db.update(documents).set({ status: "completed" }).where(eq(documents.id, documentId))
    console.log(`[worker]: 7. Document ${documentId} processing complete!`)

  } catch (error) {
    console.error(`[worker]: Job for ${documentId} FAILED:`, error)
    await db.update(documents).set({ status: "failed" }).where(eq(documents.id, documentId))
    throw error 
  }
 }


new Worker("prepare-queue", processor, { connection })

console.log("[worker]: Worker is running and listening for jobs...")