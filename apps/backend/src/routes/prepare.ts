import { Router } from "express"
import { prepareDocument , getDocumentStatus} from "../controllers/prepareController"

const router = Router()

router.get("/health", (req, res) => {
  res.status(200).send("OK")
})

router.post("/prepare", prepareDocument)
router.get("/prepare/status/:id", getDocumentStatus)

export default router