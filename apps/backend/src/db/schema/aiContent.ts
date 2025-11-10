import { pgTable, text, uuid, timestamp, jsonb, serial, integer } from "drizzle-orm/pg-core"
import { documents } from "./documents"

export const summaries = pgTable("summaries", {
  id: serial("id").primaryKey(),
  documentId: uuid("document_id").references(() => documents.id).unique(),
  text: text("text").notNull(),
  modelName: text("model_name"),
  createdAt: timestamp("created_at").defaultNow(),
})

export const faqs = pgTable("faqs", {
  id: serial("id").primaryKey(),
  documentId: uuid("document_id").references(() => documents.id),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
})

export const mcqs = pgTable("mcqs", {
  id: serial("id").primaryKey(),
  documentId: uuid("document_id").references(() => documents.id),
  question: text("question").notNull(),
  options: jsonb("options").$type<{ id: string; text: string }[]>().notNull(),
  correctOption: text("correct_option").notNull(),
  explanation: text("explanation"),
  createdAt: timestamp("created_at").defaultNow(),
})

export const roadmaps = pgTable("roadmaps", {
  id: serial("id").primaryKey(),
  documentId: uuid("document_id").references(() => documents.id).unique(),
  title: text("title").default("Generated Roadmap"),
  createdAt: timestamp("created_at").defaultNow(),
})

export const roadmapNodes = pgTable("roadmap_nodes", {
  id: text("id").primaryKey(),
  roadmapId: integer("roadmap_id").references(() => roadmaps.id),
  parentId: text("parent_id"),
  label: text("label").notNull(),
  position: jsonb("position").$type<{ x: number; y: number }>().notNull(),
  style: jsonb("style"),
})