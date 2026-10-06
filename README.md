# SESaaS (AWS SES as a Service)

A lightweight Node.js Express service for dispatching emails via AWS Simple Email Service (SES) with domain `jagadeeswar.dev`, built to run locally and deploy seamlessly to Firebase Functions v2 (`asia-south1`).

---

## 🚀 Features

- **AWS SES v3 Client**: Sends HTML emails securely using `@aws-sdk/client-ses`.
- **Flexible Payload Support**: Accepts both standard spaced keys (`secret password`, `input email`, `raw html data`) and camelCase/snake_case variations.
- **Fixed Secret Authentication**: Protects the endpoint against unauthorized invocation.
- **CORS Configured**: Pre-configured with your domains (`jagadeeswar.dev`, `sports.jagadeeswar.dev`, `vnrvjietsportsfest.web.app`, etc.) and expandable via `.env`.
- **Dual Runtime Support**:
  - Run locally with Express (`npm run dev` or `npm start` on port `3033`).
  - Deploy directly as a Firebase Function (`npm run deploy` via `firebase-functions/v2/https`).

---

## 📬 API Specification

### Endpoint: `POST /email/send` (also available at `POST /send` and `POST /`)

#### Headers
```http
Content-Type: application/json
```

#### Request Body
```json
{
  "secret password": "change_this_secret_password",
  "input email": [
    "recipient1@example.com",
    "recipient2@example.com"
  ],
  "subject": "Greetings from jagadeeswar.dev",
  "raw html data": "<h1>Hello!</h1><p>This is an automated email sent via AWS SES.</p>"
}
```

> **Note:**
> - `secret password`: Must match `SECRET_PASSWORD` configured in `.env`.
> - `input email`: Accepts either an array of email strings or a single email string.
> - `raw html data`: Complete raw HTML string for the email body.
> - Optional parameters: `from` (custom sender), `cc`, `bcc`, `replyTo`.

#### Successful Response (`200 OK`)
```json
{
  "success": true,
  "message": "Email sent successfully",
  "messageId": "0100018f...-000000",
  "recipients": [
    "recipient1@example.com",
    "recipient2@example.com"
  ]
}
```

#### Unauthorized Response (`401 Unauthorized`)
```json
{
  "success": false,
  "message": "Unauthorized: Invalid or missing secret password"
}
```

#### Validation Error Response (`400 Bad Request`)
```json
{
  "success": false,
  "message": "Validation error: 'subject' is required and must be a non-empty string"
}
```

---

## ⚙️ Environment Variables (`.env`)

| Variable | Description | Default / Example |
| :--- | :--- | :--- |
| `PORT` | Port for local Express server | `3033` |
| `AWS_REGION` | AWS SES Region | `ap-south-1` |
| `AWS_ACCESS_KEY_ID` | IAM User Access Key ID with SES permissions | `AKIA...` |
| `AWS_SECRET_ACCESS_KEY` | IAM User Secret Access Key | `...` |
| `AWS_SES_SENDER_EMAIL` | Default From address | `noreply@jagadeeswar.dev` |
| `DOMAIN` | Configured sending domain | `jagadeeswar.dev` |
| `SECRET_PASSWORD` | Shared secret password required in API requests | Set in `.env` |
| `ALLOWED_ORIGINS` | Comma-separated list of CORS origins | `https://jagadeeswar.dev,...` |

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

3. Health check:
   Open `http://localhost:3033/` in your browser.

---

## ☁️ Firebase Deployment

Deploy to Firebase Functions (region `asia-south1`):
```bash
npm run deploy
```
or
```bash
firebase deploy --only functions
```

