import { SES, S3 } from 'aws-sdk';

const ses = new SES();
const s3 = new S3();

interface EmailEvent {
  to: string[];
  cc?: string[];
  subject: string;
  templateKey: string;
  replacements: Record<string, string>;
}

function replaceTemplateVars(template: string, replacements: Record<string, string>): string {
  let result = template;
  for (const [key, value] of Object.entries(replacements)) {
    result = result.replace(new RegExp(`{{${key}}}`, 'g'), value);
  }
  return result;
}

export const handler = async (event: EmailEvent) => {
  const bucketName = process.env.TEMPLATE_BUCKET!;
  const templateKey = event.templateKey;

  try {
    const templateObj = await s3.getObject({ Bucket: bucketName, Key: templateKey }).promise();
    const templateStr = templateObj.Body!.toString('utf-8');
    const bodyHtml = replaceTemplateVars(templateStr, event.replacements);

    await ses.sendEmail({
      Destination: {
        ToAddresses: event.to,
        CcAddresses: event.cc ?? [],
      },
      Message: {
        Subject: { Data: event.subject },
        Body: {
          Html: { Data: bodyHtml },
        },
      },
      Source: 'anandu.avaj@gmail.com',
    }).promise();

    return { statusCode: 200, body: 'Email sent successfully' };
  } catch (error) {
    console.error('Error sending email:', error);
    return { statusCode: 500, body: 'Failed to send email' };
  }
};
