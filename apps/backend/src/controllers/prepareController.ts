import { Request, Response } from "express"
import * as prepareService from "../services/prepareService"

export async function prepareDocument(req: Request, res: Response) {
  try {
    const { sourceUrl, sourceType } = req.body

    if (!sourceUrl || !sourceType) {
      return res.status(400).json({ error: "sourceUrl and sourceType are required" })
    }

    const newDocument = await prepareService.processDocument(sourceUrl, sourceType)

    res.status(200).json({ 
      message: "Document created and processed successfully.",
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