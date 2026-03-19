import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, tourDatesTable, toursTable } from "@workspace/db";
import {
  ListTourDatesResponse,
  CreateTourDateBody,
  UpdateTourDateBody,
  UpdateTourDateParams,
  DeleteTourDateParams,
  ListTourDatesQueryParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/tour-dates", async (req, res): Promise<void> => {
  const query = ListTourDatesQueryParams.safeParse(req.query);
  let results;
  if (query.success && query.data.tourId) {
    results = await db.select({
      id: tourDatesTable.id,
      tourId: tourDatesTable.tourId,
      startDate: tourDatesTable.startDate,
      endDate: tourDatesTable.endDate,
      availableSpots: tourDatesTable.availableSpots,
      maxRiders: tourDatesTable.maxRiders,
      isActive: tourDatesTable.isActive,
      createdAt: tourDatesTable.createdAt,
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
      }
    }).from(tourDatesTable)
      .leftJoin(toursTable, eq(tourDatesTable.tourId, toursTable.id))
      .where(eq(tourDatesTable.tourId, query.data.tourId))
      .orderBy(tourDatesTable.startDate);
  } else {
    results = await db.select({
      id: tourDatesTable.id,
      tourId: tourDatesTable.tourId,
      startDate: tourDatesTable.startDate,
      endDate: tourDatesTable.endDate,
      availableSpots: tourDatesTable.availableSpots,
      maxRiders: tourDatesTable.maxRiders,
      isActive: tourDatesTable.isActive,
      createdAt: tourDatesTable.createdAt,
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
      }
    }).from(tourDatesTable)
      .leftJoin(toursTable, eq(tourDatesTable.tourId, toursTable.id))
      .orderBy(tourDatesTable.startDate);
  }
  const parsed = results.map(r => ({
    ...r,
    startDate: r.startDate ? new Date(r.startDate) : r.startDate,
    endDate: r.endDate ? new Date(r.endDate) : r.endDate,
    tour: r.tour ? { ...r.tour, priceEur: Number(r.tour.priceEur) } : undefined,
  }));
  res.json(ListTourDatesResponse.parse(parsed));
});

router.post("/tour-dates", async (req, res): Promise<void> => {
  const parsed = CreateTourDateBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [date] = await db.insert(tourDatesTable).values(parsed.data).returning();
  const [full] = await db.select({
    id: tourDatesTable.id,
    tourId: tourDatesTable.tourId,
    startDate: tourDatesTable.startDate,
    endDate: tourDatesTable.endDate,
    availableSpots: tourDatesTable.availableSpots,
    maxRiders: tourDatesTable.maxRiders,
    isActive: tourDatesTable.isActive,
    createdAt: tourDatesTable.createdAt,
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
    }
  }).from(tourDatesTable)
    .leftJoin(toursTable, eq(tourDatesTable.tourId, toursTable.id))
    .where(eq(tourDatesTable.id, date.id));
  res.status(201).json({ ...full, tour: full.tour ? { ...full.tour, priceEur: Number(full.tour.priceEur) } : undefined });
});

router.put("/tour-dates/:id", async (req, res): Promise<void> => {
  const params = UpdateTourDateParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = UpdateTourDateBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [date] = await db.update(tourDatesTable)
    .set(parsed.data)
    .where(eq(tourDatesTable.id, params.data.id))
    .returning();
  if (!date) {
    res.status(404).json({ error: "Tour date not found" });
    return;
  }
  res.json(date);
});

router.delete("/tour-dates/:id", async (req, res): Promise<void> => {
  const params = DeleteTourDateParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  await db.delete(tourDatesTable).where(eq(tourDatesTable.id, params.data.id));
  res.sendStatus(204);
});

export default router;
