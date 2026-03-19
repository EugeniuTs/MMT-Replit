import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, bookingsTable, toursTable } from "@workspace/db";
import Stripe from "stripe";
import {
  CreatePaymentIntentBody,
  ConfirmPaymentBody,
} from "@workspace/api-zod";

const router: IRouter = Router();

const getStripe = () => {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
  return new Stripe(key);
};

router.post("/payments/create-intent", async (req, res): Promise<void> => {
  const parsed = CreatePaymentIntentBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [booking] = await db.select().from(bookingsTable).where(eq(bookingsTable.id, parsed.data.bookingId));
  if (!booking) {
    res.status(404).json({ error: "Booking not found" });
    return;
  }

  const amountEur = parsed.data.paymentType === "deposit"
    ? Number(booking.depositAmount)
    : Number(booking.totalAmount);

  const amountCents = Math.round(amountEur * 100);

  try {
    const stripe = getStripe();
    const intent = await stripe.paymentIntents.create({
      amount: amountCents,
      currency: "eur",
      metadata: {
        bookingId: String(booking.id),
        paymentType: parsed.data.paymentType,
      },
    });

    res.json({
      clientSecret: intent.client_secret!,
      amount: amountEur,
      currency: "eur",
    });
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : "Payment error" });
  }
});

router.post("/payments/confirm", async (req, res): Promise<void> => {
  const parsed = ConfirmPaymentBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  try {
    const stripe = getStripe();
    const intent = await stripe.paymentIntents.retrieve(parsed.data.paymentIntentId);
    if (intent.status !== "succeeded") {
      res.status(400).json({ error: "Payment not completed" });
      return;
    }

    const [booking] = await db.update(bookingsTable)
      .set({
        paymentStatus: "paid",
        bookingStatus: "approved",
        stripePaymentIntentId: parsed.data.paymentIntentId,
      })
      .where(eq(bookingsTable.id, parsed.data.bookingId))
      .returning();

    if (!booking) {
      res.status(404).json({ error: "Booking not found" });
      return;
    }

    const [tour] = await db.select().from(toursTable).where(eq(toursTable.id, booking.tourId));

    res.json({
      ...booking,
      totalAmount: Number(booking.totalAmount),
      depositAmount: Number(booking.depositAmount),
      tour: tour ? { ...tour, priceEur: Number(tour.priceEur) } : undefined,
    });
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : "Confirmation error" });
  }
});

export default router;
