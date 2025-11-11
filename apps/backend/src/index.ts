import express from "express"
import prepareRouter from "./routes/prepare"

const app = express()

app.use(express.json())

app.get("/", (req, res) => {
  res.send("Hello from the Backend!")
})

app.use("/api", prepareRouter)

export default app