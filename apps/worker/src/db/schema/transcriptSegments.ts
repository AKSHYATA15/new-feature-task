import { pgTable, text, uuid, timestamp, integer, serial } from "drizzle-orm/pg-core"
import { documents } from "./documents"

export const transcript_segments = pgTable("transcript_segments", {
  id: serial("id").primaryKey(),
  documentId: uuid("document_id").references(() => documents.id),
  text: text("text").notNull(),
  startTime: integer("start_time").notNull(),
  endTime: integer("end_time").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
})