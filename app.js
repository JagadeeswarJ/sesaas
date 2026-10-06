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

const allowedOrigins = [
  "https://vnrvjietsportsfest.web.app",
  "https://vnrvjietsports.in",
  "http://localhost:5173",
  "https://sports.jagadeeswar.dev",
  "https://vnrsportsfestdev.web.app",
  "https://jagadeeswar.dev",
  "http://localhost:3000",
  "http://localhost:3033",
];

// Allow additional origins specified via .env (comma-separated)
if (process.env.ALLOWED_ORIGINS) {
  process.env.ALLOWED_ORIGINS.split(",").forEach((origin) => {
    const trimmed = origin.trim();
    if (trimmed && !allowedOrigins.includes(trimmed)) {
      allowedOrigins.push(trimmed);
    }
  });
}

app.use(
  cors({
    origin: function (origin, callback) {
      if (
        !origin ||
        allowedOrigins.indexOf(origin) !== -1 ||
        process.env.NODE_ENV !== "production"
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "OPTIONS"],
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

// Email API routes
app.use("/email", emailRoutes);
app.use("/api", emailRoutes);
app.use("/", emailRoutes);

// Root health check endpoint
app.get("/", (req, res) => {
  res.send("<h1>SESaaS - AWS SES Email Service</h1><p>Status: Active | Domain: jagadeeswar.dev</p>");
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

