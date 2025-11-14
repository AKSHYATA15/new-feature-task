import { Request, Response } from "express"
import * as prepareService from "../services/prepareService"
import { prepareQueue } from "../services/queueService"
import { PDFParse } from "pdf-parse"
import { db } from "../db/client"
import { pdf_store } from "../db/schema/main"

export async function preparePdf(req: Request, res: Response) {
  try {
    const { title } = req.body
    const file = req.file
    let documentTitle: string = title

    if (!file) {
      return res.status(400).json({ error: "No PDF file uploaded." })
    }
    if (!title) documentTitle = file.originalname

    console.log(`[controller]: PDF file received: ${file.originalname}`)
    
    const parser = new PDFParse({ data: file.buffer })
    const result = await parser.getText()
    const rawText = result.text
    await parser.destroy()

    if (!rawText || rawText.trim() === "") {
      return res.status(400).json({ error: "Could not extract text from PDF." })
    }

    const newDocument = await prepareService.createPdfDocument(rawText, documentTitle)

    const base64Content = file.buffer.toString('base64')
    
    await db.insert(pdf_store).values({
      documentId: newDocument.id,
      base64Content: base64Content
    })
    console.log(`[controller]: PDF base64 content saved to pdf_store!`)
    
    await prepareQueue.add("process-document", {
      documentId: newDocument.id,
      sourceType: "pdf",
      sourceUrl: "",
    })

    console.log(`[controller]: Job added for PDF: ${newDocument.id}`)

    res.status(202).json({ 
      message: "Job accepted. Processing has started.",
      documentId: newDocument.id,
    })

  } catch (error: any) {
    console.error("Error in preparePdf controller:", error)
    res.status(500).json({ 
      error: "Internal server error",
      message: error.message 
    })
  }
}