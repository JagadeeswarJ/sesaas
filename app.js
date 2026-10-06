import express from "express";
import cors from "cors";
import favicon from "serve-favicon";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import emailRoutes from "./routes/emailRoutes.js";

dotenv.config();

const app = express();

// CORS middleware allowing all origins (http, https, localhost, any port, curl, Postman)
app.use(
  cors({
    origin: function (origin, callback) {
      callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-secret-password"],
  })
);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const faviconPath = path.join(__dirname, "public", "favicon.ico");
if (fs.existsSync(faviconPath)) {
  app.use(favicon(faviconPath));
}

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Email API routes (POST /email/send)
app.use("/email", emailRoutes);

// Root endpoint: simple JSON with API specification
app.get("/", (req, res) => {
  const domain = process.env.DOMAIN || "jagadeeswar.dev";
  const defaultSender =
    process.env.AWS_SES_SENDER_EMAIL || `sesaas@${domain}`;

  res.json({
    service: "SESaaS - AWS SES Email Service",
    status: "active",
    domain: domain,
    sender: defaultSender,
    endpoint: "POST /email/send",
    headers: {
      "Content-Type": "application/json",
    },
    expectedPayload: {
      "secret password": "fixed secret password (matches SECRET_PASSWORD in .env)",
      "input email": [
        "recipient1@example.com",
        "recipient2@example.com",
      ],
      subject: "Your email subject string",
      raw_html: "<h1>Your HTML content</h1><p>Email body text...</p>",
    },
    exampleCall: {
      url: "http://localhost:3033/email/send",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        "secret password": "your_fixed_secret_password",
        "input email": [
          "recipient1@example.com",
          "recipient2@example.com",
        ],
        subject: `Greetings from ${domain}`,
        raw_html: "<h1>Hello!</h1><p>This is a raw HTML email message sent independently via AWS SES.</p>",
      },
    },
    curlExample:
      'curl -X POST http://localhost:3033/email/send -H "Content-Type: application/json" -d \'{"secret password":"your_secret_password","input email":["user1@example.com","user2@example.com"],"subject":"Hello","raw_html":"<h1>Hello World</h1>"}\'',
    notes:
      "Emails to an array of recipients are dispatched independently; recipients will only see their own email address in the inbox.",
  });
});

// For handling errors
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || "Something broke, Contact developer :)",
  });
});

export default app;