import { pgTable, text, uuid } from "drizzle-orm/pg-core"
import { documents } from "./documents"

export const pdf_store = pgTable("pdf_store", {
  documentId: uuid("document_id").primaryKey().references(() => documents.id),
  base64Content: text("base64_content").notNull(),
})