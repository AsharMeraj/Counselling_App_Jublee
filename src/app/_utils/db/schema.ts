// src/db/schema.ts
import { pgTable, serial, varchar, text, timestamp, integer } from "drizzle-orm/pg-core";

export const all_entries = pgTable("all_entries", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  age: integer("age").notNull(),
  gender: varchar("gender", { length: 15 }).notNull(),
  phoneNumber: varchar("phoneNumber", { length: 20 }).notNull(),
  created_at: timestamp("created_at").defaultNow(),
});

export const results = pgTable("results", {
  id: serial("id").primaryKey(),
  entryId: integer("entryId").notNull().references(() => all_entries.id),
  questionnaireType: varchar("questionnaireType", { length: 50 }).notNull(),
  totalScore: integer("totalScore").notNull(),
  created_at: timestamp("created_at").defaultNow(),
});

