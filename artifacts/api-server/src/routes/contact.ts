import { Router, type IRouter } from "express";
import { SubmitContactBody } from "@workspace/api-zod";

const router: IRouter = Router();

router.post("/contact", async (req, res): Promise<void> => {
  const parsed = SubmitContactBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  console.log("Contact form submission:", parsed.data);

  res.json({ success: true, message: "Thank you for your message! We will get back to you within 24 hours." });
});

export default router;
