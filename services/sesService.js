import { SendEmailCommand } from "@aws-sdk/client-ses";
import { sesClient } from "../config/awsConfig.js";

/**
 * Sends an email using AWS SES.
 * @param {Object} params
 * @param {string[]|string} params.to - Recipient email address(es)
 * @param {string} params.subject - Email subject
 * @param {string} params.html - Raw HTML content
 * @param {string} [params.from] - Optional custom sender address
 * @param {string[]|string} [params.cc] - Optional CC email address(es)
 * @param {string[]|string} [params.bcc] - Optional BCC email address(es)
 * @param {string[]|string} [params.replyTo] - Optional Reply-To email address(es)
 * @returns {Promise<Object>} AWS SES SendEmailCommand output
 */
export const sendSesEmail = async ({
  to,
  subject,
  html,
  from,
  cc,
  bcc,
  replyTo,
}) => {
  const defaultDomain = process.env.DOMAIN || "jagadeeswar.dev";
  const defaultSender =
    process.env.AWS_SES_SENDER_EMAIL || `noreply@${defaultDomain}`;

  const sourceEmail = from || defaultSender;

  const toAddresses = Array.isArray(to) ? to : [to];
  const ccAddresses = cc ? (Array.isArray(cc) ? cc : [cc]) : [];
  const bccAddresses = bcc ? (Array.isArray(bcc) ? bcc : [bcc]) : [];
  const replyToAddresses = replyTo
    ? Array.isArray(replyTo)
      ? replyTo
      : [replyTo]
    : undefined;

  const emailCommand = new SendEmailCommand({
    Source: sourceEmail,
    Destination: {
      ToAddresses: toAddresses,
      ...(ccAddresses.length > 0 && { CcAddresses: ccAddresses }),
      ...(bccAddresses.length > 0 && { BccAddresses: bccAddresses }),
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
    ...(replyToAddresses && { ReplyToAddresses: replyToAddresses }),
  });

  return await sesClient.send(emailCommand);
};

