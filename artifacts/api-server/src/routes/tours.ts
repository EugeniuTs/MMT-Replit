import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, toursTable } from "@workspace/db";
import {
  ListToursResponse,
  GetTourResponse,
  CreateTourBody,
  UpdateTourBody,
  GetTourParams,
  UpdateTourParams,
  DeleteTourParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/tours", async (_req, res): Promise<void> => {
  const tours = await db.select().from(toursTable).orderBy(toursTable.createdAt);
  res.json(ListToursResponse.parse(tours.map(t => ({ ...t, priceEur: Number(t.priceEur) }))));
});

router.get("/tours/:id", async (req, res): Promise<void> => {
  const params = GetTourParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [tour] = await db.select().from(toursTable).where(eq(toursTable.id, params.data.id));
  if (!tour) {
    res.status(404).json({ error: "Tour not found" });
    return;
  }
  res.json(GetTourResponse.parse({ ...tour, priceEur: Number(tour.priceEur) }));
});

router.post("/tours", async (req, res): Promise<void> => {
  const parsed = CreateTourBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [tour] = await db.insert(toursTable).values({
    ...parsed.data,
    priceEur: String(parsed.data.priceEur),
  }).returning();
  res.status(201).json(GetTourResponse.parse({ ...tour, priceEur: Number(tour.priceEur) }));
});

router.put("/tours/:id", async (req, res): Promise<void> => {
  const params = UpdateTourParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = UpdateTourBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [tour] = await db.update(toursTable)
    .set({ ...parsed.data, priceEur: String(parsed.data.priceEur) })
    .where(eq(toursTable.id, params.data.id))
    .returning();
  if (!tour) {
    res.status(404).json({ error: "Tour not found" });
    return;
  }
  res.json(GetTourResponse.parse({ ...tour, priceEur: Number(tour.priceEur) }));
});

router.delete("/tours/:id", async (req, res): Promise<void> => {
  const params = DeleteTourParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  await db.delete(toursTable).where(eq(toursTable.id, params.data.id));
  res.sendStatus(204);
});

export default router;
