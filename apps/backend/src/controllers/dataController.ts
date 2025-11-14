import { Request, Response } from "express"
import { db } from "../db/client"
import { documents, summaries , mcqs, faqs, roadmapNodes, roadmaps , pdf_store, transcript_segments} from "../db/schema/main"
import { eq, sql } from "drizzle-orm"

export async function getDocumentStatus(req: Request, res: Response) {
  try {
    const { id } = req.params

    if (!id) {
      return res.status(400).json({ error: "Document ID is required" })
    }

    const document = await db
      .select({
        status: documents.status
      })
      .from(documents)
      .where(eq(documents.id, id))

    if (document.length === 0) {
      return res.status(404).json({ error: "Document not found" })
    }

    const status = document[0].status

    res.status(200).json({
      documentId: id,
      status: status
    })

  } catch (error: any) {
    console.error("Error in getDocumentStatus controller:", error)
    res.status(500).json({ 
      error: "Internal server error",
      message: error.message 
    })
  }
}

export async function getSummary(req: Request, res: Response) {
  try {
    const { documentId } = req.params
    const result = await db
      .select()
      .from(summaries)
      .where(eq(summaries.documentId, documentId))
      .limit(1)
    
    res.status(200).json(result[0] || {})
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}

export async function getFAQs(req: Request, res: Response) {
  try {
    const { documentId } = req.params
    const result = await db
      .select()
      .from(faqs)
      .where(eq(faqs.documentId, documentId))
    
    res.status(200).json(result)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}

export async function getMCQs(req: Request, res: Response) {
  try {
    const { documentId } = req.params
    const result = await db
      .select()
      .from(mcqs)
      .where(eq(mcqs.documentId, documentId))
    
    res.status(200).json(result)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}

export async function getRoadmap(req: Request, res: Response) {
  try {
    const { documentId } = req.params
    
    const roadmapResult = await db
      .select({ id: roadmaps.id })
      .from(roadmaps)
      .where(eq(roadmaps.documentId, documentId))
      .limit(1)

    if (roadmapResult.length === 0) {
      return res.status(404).json({ error: "Roadmap not found" })
    }
    const roadmapId = roadmapResult[0].id

    const nodes = await db
      .select()
      .from(roadmapNodes)
      .where(eq(roadmapNodes.roadmapId, roadmapId))
      
    const edges = []
    for (const node of nodes) {
      if (node.parentId) {
        edges.push({
          id: `e-${node.parentId}-${node.id}`,
          source: node.parentId,
          target: node.id
        })
      }
    }
    
    res.status(200).json({ nodes, edges })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}

export async function getTranscriptSegments(req: Request, res: Response) {
  try {
    const { documentId } = req.params
    const result = await db
      .select({
        text: transcript_segments.text,
        startTime: transcript_segments.startTime,
        timestamp: sql<string>`to_char((${transcript_segments.startTime} || ' second')::interval, 'MI:SS')`
      })
      .from(transcript_segments)
      .where(eq(transcript_segments.documentId, documentId))
      .orderBy(transcript_segments.startTime)
    
    res.status(200).json(result)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}

export async function getPdfData(req: Request, res: Response) {
  try {
    const { documentId } = req.params
    const result = await db
      .select({ base64Content: pdf_store.base64Content })
      .from(pdf_store)
      .where(eq(pdf_store.documentId, documentId))
      .limit(1)
    
    if (result.length === 0) {
      return res.status(404).json({ error: "PDF data not found" })
    }
    res.status(200).json(result[0])
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}

export async function getDocumentInfo(req: Request, res: Response) {
  try {
    const { documentId } = req.params
    const result = await db
      .select({
        id: documents.id,
        sourceType: documents.sourceType,
        sourceUrl: documents.sourceUrl,
        title: documents.title,
        status: documents.status
      })
      .from(documents)
      .where(eq(documents.id, documentId))
      .limit(1)
    
    if (result.length === 0) {
      return res.status(404).json({ error: "Document not found" })
    }
    res.status(200).json(result[0])
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}