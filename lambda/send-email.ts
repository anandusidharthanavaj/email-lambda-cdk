import { EmailClient } from "../utils/email-client";
import { getCompiledHtmlFromTemplate } from "../utils/template-loader"; // helper for loading and replacing

const sender = process.env.EMAIL_SENDER;
const region = process.env.AWS_REGION;

if (!sender || !region) {
  throw new Error("Missing EMAIL_SENDER or AWS_REGION environment variable.");
}

const emailClient = new EmailClient(region, sender);

const bucketName = process.env.TEMPLATE_BUCKET!;

interface EmailEvent {
  to: string;
  subject: string;
  templateKey: string;
  replacements: Record<string, string>;
}

exports.handler = async (event: EmailEvent) => {
  const { to, subject, templateKey, replacements } = event;

  // Load HTML from S3 and replace placeholders
  const bodyHtml = await getCompiledHtmlFromTemplate(
    bucketName,
    templateKey,
    replacements
  );
  if (!bodyHtml) {
    console.error("Template compilation failed — bodyHtml is empty.");
    throw new Error("Failed to compile email template.");
  }

  console.log("EMAIL_SENDER ENV emailClient:", emailClient);
  await emailClient.sendEmail(to, subject, bodyHtml);
  return { statusCode: 200, message: "Email sent successfully" };
};
