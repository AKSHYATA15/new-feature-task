import "dotenv/config"
import { Queue, Worker } from "bullmq"
import IORedis from "ioredis"

if (!process.env.REDIS_URL) {
  throw new Error("REDIS_URL is not set in .env file")
}

const connection = new IORedis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null,
  tls: {
    rejectUnauthorized: false
  }
})

connection.on('connect', () => console.log('[redis]: Connected to Upstash!'))
connection.on('error', (err) => console.error('[redis]: Connection error', err))

export const prepareQueue = new Queue("prepare-queue", { connection })
