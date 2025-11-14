import express from "express"
import prepareRouter from "./routes/prepare"
import cors from "cors"

const app = express()

app.use(cors())
app.use(express.json())

app.get("/", (req, res) => {
  res.send("Hello from the Backend!")
})

app.use("/api", prepareRouter)

export default app