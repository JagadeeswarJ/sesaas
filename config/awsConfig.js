import { SESClient } from "@aws-sdk/client-ses";
import dotenv from "dotenv";

dotenv.config();

const region = process.env.AWS_REGION || "ap-south-1";

export const sesClient = new SESClient({
  region,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

