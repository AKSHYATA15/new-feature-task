import { Router } from "express"
import { prepareDocument , getDocumentStatus, getFAQs, getMCQs
, getSummary, getRoadmap
} from "../controllers/prepareController"

const router = Router()

router.get("/health", (req, res) => {
  res.status(200).send("OK")
})

router.post("/prepare", prepareDocument)
router.get("/prepare/status/:id", getDocumentStatus)

router.get("/prepare/summary/:documentId", getSummary)
router.get("/prepare/faqs/:documentId", getFAQs)
router.get("/prepare/mcqs/:documentId", getMCQs)
router.get("/prepare/roadmap/:documentId", getRoadmap)

export default router