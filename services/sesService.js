import { SendEmailCommand } from "@aws-sdk/client-ses";
import { sesClient } from "../config/awsConfig.js";

/**
 * Sends emails independently using AWS SES to each recipient
 * so that no recipient can see other recipients in their inbox.
 *
 * @param {Object} params
 * @param {string[]} params.to - Array of recipient email addresses
 * @param {string} params.subject - Email subject
 * @param {string} params.html - Raw HTML content
 * @returns {Promise<Array<{ email: string, messageId: string }>>}
 */
export const sendSesEmail = async ({ to, subject, html }) => {
  const defaultDomain = process.env.DOMAIN || "jagadeeswar.dev";
  const sourceEmail =
    process.env.AWS_SES_SENDER_EMAIL || `sesaas@${defaultDomain}`;

  const recipientList = Array.isArray(to) ? to : [to];

  // Dispatch an independent email per recipient
  const sendPromises = recipientList.map(async (recipient) => {
    const emailCommand = new SendEmailCommand({
      Source: sourceEmail,
      Destination: {
        ToAddresses: [recipient],
      },
      Message: {
        Subject: {
          Data: subject,
          Charset: "UTF-8",
        },
        Body: {
          Html: {
            Data: html,
            Charset: "UTF-8",
          },
        },
      },
    });

    const response = await sesClient.send(emailCommand);
    return {
      email: recipient,
      messageId: response.MessageId,
    };
  });

  return await Promise.all(sendPromises);
};