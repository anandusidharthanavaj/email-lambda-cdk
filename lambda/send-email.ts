import { EmailClient } from '../utils/email-client';
import { getConfig, Environment } from '../cdk/config';

const rawEnv = process.env.ENV || 'dev';
const isEnvValid = (e: string): e is Environment => e === 'dev' || e === 'prod';

const env: Environment = isEnvValid(rawEnv) ? rawEnv : 'dev';

const config = getConfig(env);
const emailClient = new EmailClient(config.REGION, config.EMAIL_SENDER);
interface EmailEvent {
  to: string;
  subject: string;
  bodyHtml: string;
}
exports.handler = async (event: EmailEvent) => {
  const { to, subject, bodyHtml } = event;

  await emailClient.sendEmail(to, subject, bodyHtml);
  return { statusCode: 200, message: 'Email sent successfully' };
};
