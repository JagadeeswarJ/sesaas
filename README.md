# SESaaS (AWS SES as a Service)

A lightweight Node.js Express service for dispatching emails via AWS Simple Email Service (SES) with domain `jagadeeswar.dev`, built to run locally and deploy seamlessly to Firebase Functions v2 (`asia-south1`).

---

## 🚀 Key Features

- **Independent Email Dispatch**: When an array of recipient emails is provided, each email is sent as an isolated message. Recipients **never** see other recipients in the `To:` header.
- **Custom / Default Sender**: Takes an optional `from` address in the request; if omitted, automatically falls back to `sesaas@jagadeeswar.dev`.
- **Strict, Minimalist Payload**: Takes 4 required fields (`secret password`, `input email`, `subject`, `raw_html`) and 1 optional field (`from`).
- **Fixed Secret Authentication**: Protects the endpoint against unauthorized invocation (`SECRET_PASSWORD`).
- **Open CORS Policy**: Configured to accept requests from all origins (http, https, localhost on any port, curl, Postman).
- **Simple JSON Specification Root (`GET /`)**: Returns a clean JSON object documenting the API schema, required & optional fields, and an example call.
- **Dual Runtime Support**:
  - Run locally with Express (`npm run dev` or `npm start` on port `3033`).
  - Deploy directly as a Firebase Function (`npm run deploy` via `firebase-functions/v2/https`).

---

## 📬 API Specification

### Endpoint: `POST /email/send`

#### Headers
```http
Content-Type: application/json
```

#### Request Body
```json
{
  "secret password": "your_fixed_secret_password",
  "input email": [
    "recipient1@example.com",
    "recipient2@example.com"
  ],
  "subject": "Greetings from jagadeeswar.dev",
  "raw_html": "<h1>Hello!</h1><p>This is an automated email sent independently via AWS SES.</p>",
  "from": "optional_sender@jagadeeswar.dev"
}
```

> **Note:**
> - `from` is **optional**. If not provided, it defaults to `sesaas@jagadeeswar.dev`.

#### Successful Response (`200 OK`)
```json
{
  "success": true,
  "message": "Successfully sent 2 email(s)",
  "total": 2,
  "results": [
    {
      "email": "recipient1@example.com",
      "messageId": "0100018f...-000000"
    },
    {
      "email": "recipient2@example.com",
      "messageId": "0100018f...-000001"
    }
  ]
}
```

---

## 💻 Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the local server:
   ```bash
   npm run dev
   ```
   Server will start at `http://localhost:3033`.

3. API Documentation:
   ```bash
   curl http://localhost:3033/
   ```

---

## ☁️ Firebase Deployment

Deploy to Firebase Functions (region `asia-south1`):
```bash
npm run deploy
```