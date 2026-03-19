import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, motorcyclesTable } from "@workspace/db";
import {
  ListMotorcyclesResponse,
  CreateMotorcycleBody,
  UpdateMotorcycleBody,
  UpdateMotorcycleParams,
  DeleteMotorcycleParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/motorcycles", async (_req, res): Promise<void> => {
  const bikes = await db.select().from(motorcyclesTable).orderBy(motorcyclesTable.id);
  res.json(ListMotorcyclesResponse.parse(bikes));
});

router.post("/motorcycles", async (req, res): Promise<void> => {
  const parsed = CreateMotorcycleBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [bike] = await db.insert(motorcyclesTable).values(parsed.data).returning();
  res.status(201).json(bike);
});

router.put("/motorcycles/:id", async (req, res): Promise<void> => {
  const params = UpdateMotorcycleParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = UpdateMotorcycleBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [bike] = await db.update(motorcyclesTable)
    .set(parsed.data)
    .where(eq(motorcyclesTable.id, params.data.id))
    .returning();
  if (!bike) {
    res.status(404).json({ error: "Motorcycle not found" });
    return;
  }
  res.json(bike);
});

router.delete("/motorcycles/:id", async (req, res): Promise<void> => {
  const params = DeleteMotorcycleParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  await db.delete(motorcyclesTable).where(eq(motorcyclesTable.id, params.data.id));
  res.sendStatus(204);
});

export default router;
