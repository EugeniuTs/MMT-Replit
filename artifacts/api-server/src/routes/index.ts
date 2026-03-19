import { Router, type IRouter } from "express";
import healthRouter from "./health";
import toursRouter from "./tours";
import tourDatesRouter from "./tour-dates";
import motorcyclesRouter from "./motorcycles";
import bookingsRouter from "./bookings";
import paymentsRouter from "./payments";
import adminRouter from "./admin";
import contactRouter from "./contact";

const router: IRouter = Router();

router.use(healthRouter);
router.use(toursRouter);
router.use(tourDatesRouter);
router.use(motorcyclesRouter);
router.use(bookingsRouter);
router.use(paymentsRouter);
router.use(adminRouter);
router.use(contactRouter);

export default router;
