import { Router, type IRouter } from "express";
import jwt from "jsonwebtoken";
import { db, bookingsTable, toursTable, tourDatesTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { AdminLoginBody } from "@workspace/api-zod";

const router: IRouter = Router();

const JWT_SECRET = process.env.JWT_SECRET || "moldova-moto-tours-secret-2024";
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "moldova2024";

router.post("/admin/login", async (req, res): Promise<void> => {
  const parsed = AdminLoginBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  if (parsed.data.username !== ADMIN_USERNAME || parsed.data.password !== ADMIN_PASSWORD) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  const token = jwt.sign({ username: parsed.data.username, role: "admin" }, JWT_SECRET, { expiresIn: "24h" });
  res.json({ token, username: parsed.data.username });
});

router.get("/admin/bookings/export", async (req, res): Promise<void> => {
  const rows = await db.select({
    id: bookingsTable.id,
    fullName: bookingsTable.fullName,
    email: bookingsTable.email,
    phone: bookingsTable.phone,
    country: bookingsTable.country,
    ridingExperience: bookingsTable.ridingExperience,
    paymentType: bookingsTable.paymentType,
    paymentStatus: bookingsTable.paymentStatus,
    bookingStatus: bookingsTable.bookingStatus,
    totalAmount: bookingsTable.totalAmount,
    depositAmount: bookingsTable.depositAmount,
    createdAt: bookingsTable.createdAt,
    tourName: toursTable.name,
    startDate: tourDatesTable.startDate,
    endDate: tourDatesTable.endDate,
  }).from(bookingsTable)
    .leftJoin(toursTable, eq(bookingsTable.tourId, toursTable.id))
    .leftJoin(tourDatesTable, eq(bookingsTable.tourDateId, tourDatesTable.id))
    .orderBy(bookingsTable.createdAt);

  const headers = ["ID", "Name", "Email", "Phone", "Country", "Experience", "Tour", "Start Date", "End Date", "Payment Type", "Payment Status", "Booking Status", "Total (€)", "Deposit (€)", "Created At"];
  const csvRows = rows.map(r => [
    r.id,
    r.fullName,
    r.email,
    r.phone,
    r.country,
    r.ridingExperience,
    r.tourName || "",
    r.startDate || "",
    r.endDate || "",
    r.paymentType,
    r.paymentStatus,
    r.bookingStatus,
    Number(r.totalAmount),
    Number(r.depositAmount),
    r.createdAt.toISOString(),
  ].map(v => `"${String(v).replace(/"/g, '""')}"`).join(","));

  const csv = [headers.join(","), ...csvRows].join("\n");
  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", 'attachment; filename="bookings.csv"');
  res.send(csv);
});

export default router;
