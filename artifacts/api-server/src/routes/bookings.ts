import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, bookingsTable, toursTable, tourDatesTable } from "@workspace/db";
import {
  ListBookingsResponse,
  CreateBookingBody,
  GetBookingParams,
  GetBookingResponse,
  UpdateBookingStatusParams,
  UpdateBookingStatusBody,
} from "@workspace/api-zod";

const router: IRouter = Router();

const withRelations = async (id: number) => {
  const [booking] = await db.select({
    id: bookingsTable.id,
    tourId: bookingsTable.tourId,
    tourDateId: bookingsTable.tourDateId,
    motorcycleId: bookingsTable.motorcycleId,
    fullName: bookingsTable.fullName,
    email: bookingsTable.email,
    phone: bookingsTable.phone,
    country: bookingsTable.country,
    ridingExperience: bookingsTable.ridingExperience,
    hasLicense: bookingsTable.hasLicense,
    paymentType: bookingsTable.paymentType,
    paymentStatus: bookingsTable.paymentStatus,
    bookingStatus: bookingsTable.bookingStatus,
    totalAmount: bookingsTable.totalAmount,
    depositAmount: bookingsTable.depositAmount,
    stripePaymentIntentId: bookingsTable.stripePaymentIntentId,
    notes: bookingsTable.notes,
    createdAt: bookingsTable.createdAt,
    tour: {
      id: toursTable.id,
      name: toursTable.name,
      slug: toursTable.slug,
      description: toursTable.description,
      shortDescription: toursTable.shortDescription,
      durationDays: toursTable.durationDays,
      priceEur: toursTable.priceEur,
      maxRiders: toursTable.maxRiders,
      imageUrl: toursTable.imageUrl,
      highlights: toursTable.highlights,
      included: toursTable.included,
      isActive: toursTable.isActive,
      createdAt: toursTable.createdAt,
    },
    tourDate: {
      id: tourDatesTable.id,
      tourId: tourDatesTable.tourId,
      startDate: tourDatesTable.startDate,
      endDate: tourDatesTable.endDate,
      availableSpots: tourDatesTable.availableSpots,
      maxRiders: tourDatesTable.maxRiders,
      isActive: tourDatesTable.isActive,
      createdAt: tourDatesTable.createdAt,
    },
  }).from(bookingsTable)
    .leftJoin(toursTable, eq(bookingsTable.tourId, toursTable.id))
    .leftJoin(tourDatesTable, eq(bookingsTable.tourDateId, tourDatesTable.id))
    .where(eq(bookingsTable.id, id));
  return booking;
};

router.get("/bookings", async (_req, res): Promise<void> => {
  const rows = await db.select({
    id: bookingsTable.id,
    tourId: bookingsTable.tourId,
    tourDateId: bookingsTable.tourDateId,
    motorcycleId: bookingsTable.motorcycleId,
    fullName: bookingsTable.fullName,
    email: bookingsTable.email,
    phone: bookingsTable.phone,
    country: bookingsTable.country,
    ridingExperience: bookingsTable.ridingExperience,
    hasLicense: bookingsTable.hasLicense,
    paymentType: bookingsTable.paymentType,
    paymentStatus: bookingsTable.paymentStatus,
    bookingStatus: bookingsTable.bookingStatus,
    totalAmount: bookingsTable.totalAmount,
    depositAmount: bookingsTable.depositAmount,
    stripePaymentIntentId: bookingsTable.stripePaymentIntentId,
    notes: bookingsTable.notes,
    createdAt: bookingsTable.createdAt,
    tour: {
      id: toursTable.id,
      name: toursTable.name,
      slug: toursTable.slug,
      description: toursTable.description,
      shortDescription: toursTable.shortDescription,
      durationDays: toursTable.durationDays,
      priceEur: toursTable.priceEur,
      maxRiders: toursTable.maxRiders,
      imageUrl: toursTable.imageUrl,
      highlights: toursTable.highlights,
      included: toursTable.included,
      isActive: toursTable.isActive,
      createdAt: toursTable.createdAt,
    },
    tourDate: {
      id: tourDatesTable.id,
      tourId: tourDatesTable.tourId,
      startDate: tourDatesTable.startDate,
      endDate: tourDatesTable.endDate,
      availableSpots: tourDatesTable.availableSpots,
      maxRiders: tourDatesTable.maxRiders,
      isActive: tourDatesTable.isActive,
      createdAt: tourDatesTable.createdAt,
    },
  }).from(bookingsTable)
    .leftJoin(toursTable, eq(bookingsTable.tourId, toursTable.id))
    .leftJoin(tourDatesTable, eq(bookingsTable.tourDateId, tourDatesTable.id))
    .orderBy(bookingsTable.createdAt);

  const mapped = rows.map(r => ({
    ...r,
    totalAmount: Number(r.totalAmount),
    depositAmount: Number(r.depositAmount),
    tour: r.tour ? { ...r.tour, priceEur: Number(r.tour.priceEur) } : undefined,
    tourDate: r.tourDate ? {
      ...r.tourDate,
      startDate: r.tourDate.startDate ? new Date(r.tourDate.startDate) : r.tourDate.startDate,
      endDate: r.tourDate.endDate ? new Date(r.tourDate.endDate) : r.tourDate.endDate,
    } : undefined,
  }));
  res.json(ListBookingsResponse.parse(mapped));
});

router.post("/bookings", async (req, res): Promise<void> => {
  const parsed = CreateBookingBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [tour] = await db.select().from(toursTable).where(eq(toursTable.id, parsed.data.tourId));
  if (!tour) {
    res.status(404).json({ error: "Tour not found" });
    return;
  }

  const price = Number(tour.priceEur);
  const totalAmount = price;
  const depositAmount = Math.round(price * 0.2 * 100) / 100;

  const [booking] = await db.insert(bookingsTable).values({
    ...parsed.data,
    motorcycleId: parsed.data.motorcycleId ?? null,
    totalAmount: String(totalAmount),
    depositAmount: String(depositAmount),
  }).returning();

  const full = await withRelations(booking.id);
  if (!full) {
    res.status(500).json({ error: "Failed to create booking" });
    return;
  }
  const result = {
    ...full,
    totalAmount: Number(full.totalAmount),
    depositAmount: Number(full.depositAmount),
    tour: full.tour ? { ...full.tour, priceEur: Number(full.tour.priceEur) } : undefined,
    tourDate: full.tourDate ? {
      ...full.tourDate,
      startDate: full.tourDate.startDate ? new Date(full.tourDate.startDate) : full.tourDate.startDate,
      endDate: full.tourDate.endDate ? new Date(full.tourDate.endDate) : full.tourDate.endDate,
    } : undefined,
  };
  res.status(201).json(result);
});

router.get("/bookings/:id", async (req, res): Promise<void> => {
  const params = GetBookingParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const booking = await withRelations(params.data.id);
  if (!booking) {
    res.status(404).json({ error: "Booking not found" });
    return;
  }
  const result = {
    ...booking,
    totalAmount: Number(booking.totalAmount),
    depositAmount: Number(booking.depositAmount),
    tour: booking.tour ? { ...booking.tour, priceEur: Number(booking.tour.priceEur) } : undefined,
    tourDate: booking.tourDate ? {
      ...booking.tourDate,
      startDate: booking.tourDate.startDate ? new Date(booking.tourDate.startDate) : booking.tourDate.startDate,
      endDate: booking.tourDate.endDate ? new Date(booking.tourDate.endDate) : booking.tourDate.endDate,
    } : undefined,
  };
  res.json(GetBookingResponse.parse(result));
});

router.patch("/bookings/:id", async (req, res): Promise<void> => {
  const params = UpdateBookingStatusParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = UpdateBookingStatusBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const updateData: Record<string, string> = {};
  if (parsed.data.bookingStatus) updateData.bookingStatus = parsed.data.bookingStatus;
  if (parsed.data.paymentStatus) updateData.paymentStatus = parsed.data.paymentStatus;

  await db.update(bookingsTable).set(updateData).where(eq(bookingsTable.id, params.data.id));
  const booking = await withRelations(params.data.id);
  if (!booking) {
    res.status(404).json({ error: "Booking not found" });
    return;
  }
  const result = {
    ...booking,
    totalAmount: Number(booking.totalAmount),
    depositAmount: Number(booking.depositAmount),
    tour: booking.tour ? { ...booking.tour, priceEur: Number(booking.tour.priceEur) } : undefined,
    tourDate: booking.tourDate ? {
      ...booking.tourDate,
      startDate: booking.tourDate.startDate ? new Date(booking.tourDate.startDate) : booking.tourDate.startDate,
      endDate: booking.tourDate.endDate ? new Date(booking.tourDate.endDate) : booking.tourDate.endDate,
    } : undefined,
  };
  res.json(result);
});

export default router;
