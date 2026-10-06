import { Router } from "express";
import { handleSendEmail } from "../controllers/emailController.js";

const router = Router();

// Endpoint for sending email
router.post("/send", handleSendEmail);
router.post("/send-email", handleSendEmail);
router.post("/", handleSendEmail);

export default router;

