import { Request, Response } from "express"
import * as prepareService from "../services/prepareService"
import { prepareQueue } from "../services/queueService"

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