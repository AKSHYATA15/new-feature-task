import { Request, Response } from "express"
import * as prepareService from "../services/prepareService"
import { prepareQueue } from "../services/queueService"

export async function prepareYouTubeUrl(req: Request, res: Response) {
  try {
    const { sourceUrl } = req.body

    if (!sourceUrl) {
      return res.status(400).json({ error: "sourceUrl is required" })
    }

    const newDocument = await prepareService.createYouTubeDocument(sourceUrl)
    
    await prepareQueue.add("process-document", {
      documentId: newDocument.id,
      sourceType: "youtube",
      sourceUrl: sourceUrl
    })

    console.log(`[controller]: Job added for YouTube URL: ${newDocument.id}`)

    res.status(202).json({ 
      message: "Job accepted. Processing has started.",
      documentId: newDocument.id,
    })

  } catch (error: any) {
    console.error("Error in prepareYouTubeUrl controller:", error)
    res.status(500).json({ 
      error: "Internal server error",
      message: error.message 
    })
  }
}