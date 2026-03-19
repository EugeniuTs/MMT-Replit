import { pgTable, text, serial, timestamp, integer, numeric, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const toursTable = pgTable("tours", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  shortDescription: text("short_description").notNull(),
  durationDays: integer("duration_days").notNull(),
  priceEur: numeric("price_eur", { precision: 10, scale: 2 }).notNull(),
  maxRiders: integer("max_riders").notNull().default(5),
  imageUrl: text("image_url"),
  highlights: text("highlights"),
  included: text("included"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertTourSchema = createInsertSchema(toursTable).omit({ id: true, createdAt: true });
export type InsertTour = z.infer<typeof insertTourSchema>;
export type Tour = typeof toursTable.$inferSelect;
