import { pgTable, serial, timestamp, integer, boolean, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { toursTable } from "./tours";

export const tourDatesTable = pgTable("tour_dates", {
  id: serial("id").primaryKey(),
  tourId: integer("tour_id").notNull().references(() => toursTable.id, { onDelete: "cascade" }),
  startDate: date("start_date").notNull(),
  endDate: date("end_date").notNull(),
  availableSpots: integer("available_spots").notNull(),
  maxRiders: integer("max_riders").notNull().default(5),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertTourDateSchema = createInsertSchema(tourDatesTable).omit({ id: true, createdAt: true });
export type InsertTourDate = z.infer<typeof insertTourDateSchema>;
export type TourDate = typeof tourDatesTable.$inferSelect;
