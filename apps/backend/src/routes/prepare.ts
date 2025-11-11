import { Router } from "express"
import { prepareDocument } from "../controllers/prepareController"

const router = Router()

router.get("/health", (req, res) => {
  res.status(200).send("OK")
})

router.post("/prepare", prepareDocument)

export default router