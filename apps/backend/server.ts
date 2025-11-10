import "dotenv/config"
import app from "./src/index"
import { db } from "./src/db/client"
import { sql } from "drizzle-orm"

const port = process.env.PORT || 8000

async function startServer() {
  try {
    await db.execute(sql`SELECT 1`)
    console.log("✅ [database]: Connected to NeonDB successfully!")

    app.listen(port, () => {
      console.log(`[server]: Server is running at http://localhost:${port}`)
    })

  } catch (error) {
    console.error("❌ [database]: Failed to connect to the database:")
    console.error(error)
    process.exit(1)
  }
}

startServer()