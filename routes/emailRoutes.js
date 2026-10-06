import { Router } from "express";
import { handleSendEmail } from "../controllers/emailController.js";

const router = Router();

// Endpoint for sending email
router.post("/send", handleSendEmail);

export default router;