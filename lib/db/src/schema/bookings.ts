import { pgTable, text, serial, timestamp, integer, numeric, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { toursTable } from "./tours";
import { tourDatesTable } from "./tour-dates";
import { motorcyclesTable } from "./motorcycles";

export const bookingsTable = pgTable("bookings", {
  id: serial("id").primaryKey(),
  tourId: integer("tour_id").notNull().references(() => toursTable.id),
  tourDateId: integer("tour_date_id").notNull().references(() => tourDatesTable.id),
  motorcycleId: integer("motorcycle_id").references(() => motorcyclesTable.id),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  country: text("country").notNull(),
  ridingExperience: text("riding_experience").notNull(),
  hasLicense: boolean("has_license").notNull().default(true),
  paymentType: text("payment_type").notNull().default("deposit"),
  paymentStatus: text("payment_status").notNull().default("pending"),
  bookingStatus: text("booking_status").notNull().default("pending"),
  totalAmount: numeric("total_amount", { precision: 10, scale: 2 }).notNull(),
  depositAmount: numeric("deposit_amount", { precision: 10, scale: 2 }).notNull(),
  stripePaymentIntentId: text("stripe_payment_intent_id"),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertBookingSchema = createInsertSchema(bookingsTable).omit({ id: true, createdAt: true });
export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type Booking = typeof bookingsTable.$inferSelect;
