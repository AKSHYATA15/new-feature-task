import { Router } from "express"
import { getDocumentStatus, getSummary, getFAQs, getMCQs, getRoadmap } from "../controllers/dataController"
import { prepareYouTubeUrl } from "../controllers/youtubeController"
import { preparePdf } from "../controllers/pdfController"
import { upload } from "../middleware/upload"

const router = Router()

// Health check
router.get("/health", (req, res) => res.status(200).send("OK"))

// --- Job Creation ---
router.post("/prepare/youtube", prepareYouTubeUrl)
router.post("/prepare/pdf", upload.single("file"), preparePdf)

// --- Data Fetching ---
router.get("/prepare/status/:id", getDocumentStatus)
router.get("/prepare/summary/:documentId", getSummary)
router.get("/prepare/faqs/:documentId", getFAQs)
router.get("/prepare/mcqs/:documentId", getMCQs)
router.get("/prepare/roadmap/:documentId", getRoadmap)

export default router