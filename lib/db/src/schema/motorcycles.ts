import { pgTable, text, serial, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const motorcyclesTable = pgTable("motorcycles", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  brand: text("brand").notNull(),
  model: text("model").notNull(),
  year: integer("year").notNull(),
  engineCC: integer("engine_cc").notNull(),
  description: text("description").notNull(),
  specs: text("specs"),
  imageUrl: text("image_url"),
  isAvailable: boolean("is_available").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertMotorcycleSchema = createInsertSchema(motorcyclesTable).omit({ id: true, createdAt: true });
export type InsertMotorcycle = z.infer<typeof insertMotorcycleSchema>;
export type Motorcycle = typeof motorcyclesTable.$inferSelect;
