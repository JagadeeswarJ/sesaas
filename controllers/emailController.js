import { sendSesEmail } from "../services/sesService.js";

/**
 * Controller to handle POST request for sending email via AWS SES.
 *
 * Expected payload:
 * {
 *   "secret password": "fixed password",
 *   "input email": ["recipient1@example.com"],
 *   "subject": "Email Subject",
 *   "raw html data": "<h1>HTML Content</h1>"
 * }
 */
export const handleSendEmail = async (req, res, next) => {
  try {
    // 1. Authenticate secret password
    const secretPassword =
      req.body["secret password"] ??
      req.body.secretPassword ??
      req.body.secret_password ??
      req.body.password ??
      req.headers["x-secret-password"];

    const configuredSecret = process.env.SECRET_PASSWORD;

    if (!configuredSecret) {
      console.error("SECRET_PASSWORD is not set in environment variables");
      return res.status(500).json({
        success: false,
        message: "Server configuration error: SECRET_PASSWORD is not configured",
      });
    }

    if (!secretPassword || secretPassword !== configuredSecret) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Invalid or missing secret password",
      });
    }

    // 2. Validate recipient emails
    const rawEmails =
      req.body["input email"] ??
      req.body.inputEmail ??
      req.body.input_email ??
      req.body.emails ??
      req.body.to;

    let emails = [];
    if (typeof rawEmails === "string") {
      emails = [rawEmails.trim()];
    } else if (Array.isArray(rawEmails)) {
      emails = rawEmails
        .map((e) => (typeof e === "string" ? e.trim() : ""))
        .filter((e) => Boolean(e));
    }

    if (!emails.length) {
      return res.status(400).json({
        success: false,
        message:
          "Validation error: 'input email' is required and must be an email string or array of email strings",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const invalidEmails = emails.filter((email) => !emailRegex.test(email));
    if (invalidEmails.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Validation error: Invalid email address(es): ${invalidEmails.join(", ")}`,
      });
    }

    // 3. Validate subject
    const subject = req.body.subject;
    if (!subject || typeof subject !== "string" || !subject.trim()) {
      return res.status(400).json({
        success: false,
        message:
          "Validation error: 'subject' is required and must be a non-empty string",
      });
    }

    // 4. Validate raw html data
    const rawHtmlData =
      req.body["raw html data"] ??
      req.body.rawHtmlData ??
      req.body.raw_html_data ??
      req.body.html;

    if (!rawHtmlData || typeof rawHtmlData !== "string") {
      return res.status(400).json({
        success: false,
        message:
          "Validation error: 'raw html data' is required and must be an HTML string",
      });
    }

    // 5. Send email via AWS SES
    const response = await sendSesEmail({
      to: emails,
      subject: subject.trim(),
      html: rawHtmlData,
      from: req.body.from,
      cc: req.body.cc,
      bcc: req.body.bcc,
      replyTo: req.body.replyTo,
    });

    return res.status(200).json({
      success: true,
      message: "Email sent successfully",
      messageId: response.MessageId,
      recipients: emails,
    });
  } catch (error) {
    console.error("Error sending email via SES:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to send email via AWS SES",
    });
  }
};

