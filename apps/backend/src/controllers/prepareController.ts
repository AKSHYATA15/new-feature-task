import { Request, Response } from "express"
import * as prepareService from "../services/prepareService"
import { prepareQueue } from "../services/queueService"
import { db } from "../db/client"
import { documents } from "../db/schema/main"
import { eq } from "drizzle-orm"

export async function prepareDocument(req: Request, res: Response) {
  try {
    const { sourceUrl, sourceType } = req.body

    if (!sourceUrl || !sourceType) {
      return res.status(400).json({ error: "sourceUrl and sourceType are required" })
    }
    
    const newDocument = await prepareService.createDocument(sourceUrl, sourceType)

    await prepareQueue.add("process-document", {
      documentId: newDocument.id,
      sourceUrl: newDocument.sourceUrl,
      sourceType: newDocument.sourceType,
    })

    console.log(`[controller]: Job added to queue for document ID: ${newDocument.id}`)

    res.status(202).json({ 
      message: "Job accepted. Processing has started.",
      documentId: newDocument.id,
    })

  } catch (error: any) {
    console.error("Error in prepareDocument controller:", error)
    res.status(500).json({ 
      error: "Internal server error",
      message: error.message 
    })
  }
}

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