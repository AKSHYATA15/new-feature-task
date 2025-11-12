import { pgTable, text, uuid, timestamp, serial } from "drizzle-orm/pg-core"

export const documents = pgTable("documents", {
  id: uuid("id").defaultRandom().primaryKey(),
  sourceType: text("source_type", { enum: ["pdf", "youtube"] }).notNull(),
  sourceUrl: text("source_url").notNull(),
  title: text("title"),
  status: text("status", { enum: ["processing", "completed", "failed"] }).default("processing"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export const jobs = pgTable("jobs", {
  id: uuid("id").defaultRandom().primaryKey(),
  documentId: uuid("document_id").references(() => documents.id),
  jobType: text("job_type", { enum: ["summary", "faq", "mcq", "roadmap"] }).notNull(),
  status: text("status", { enum: ["processing", "completed", "failed"] }).default("processing"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})