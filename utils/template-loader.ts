import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { Readable } from 'stream';

const s3 = new S3Client({ region: process.env.AWS_REGION });

function streamToString(stream: Readable): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    stream.on('data', (chunk) => chunks.push(chunk));
    stream.on('error', reject);
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')));
  });
}

export async function loadTemplate(bucket: string, key: string): Promise<string> {
  const command = new GetObjectCommand({ Bucket: bucket, Key: key });
  const response = await s3.send(command);

  if (!response.Body || !(response.Body instanceof Readable)) {
    throw new Error('Unable to read template from S3');
  }

  return streamToString(response.Body as Readable);
}
export async function getCompiledHtmlFromTemplate(bucket: string, key: string, replacements: Record<string, string>): Promise<string> {
  const command = new GetObjectCommand({ Bucket: bucket, Key: key });
  const response = await s3.send(command);

  if (!response.Body || !(response.Body instanceof Readable)) {
    throw new Error('Unable to read template from S3');
  }

  const html = await streamToString(response.Body as Readable);

  // Replace placeholders like {{name}}, {{code}}, etc.
  return Object.entries(replacements).reduce((acc, [k, v]) => {
    const regex = new RegExp(`{{\\s*${k}\\s*}}`, 'g');
    return acc.replace(regex, v);
  }, html);
}
