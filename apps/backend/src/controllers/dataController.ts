import { Request, Response } from "express"
import { db } from "../db/client"
import { documents, summaries , mcqs, faqs, roadmapNodes, roadmaps} from "../db/schema/main"
import { eq } from "drizzle-orm"

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