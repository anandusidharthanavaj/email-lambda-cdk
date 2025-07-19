export const ENV_CONFIG = {
  dev: {
    REGION: 'ap-south-1',
    EMAIL_SENDER: 'anandu.avaj@gmail.com',
    TEMPLATE_BUCKET: 'vcanteen-dev-email-templates',
  },
  prod: {
    REGION: 'us-east-1',
    EMAIL_SENDER: 'noreply@example.com',
    TEMPLATE_BUCKET: 'vcanteen-prod-email-templates',
  },
};

export type Environment = keyof typeof ENV_CONFIG;

export function getConfig(env: Environment): typeof ENV_CONFIG[Environment] {
  return ENV_CONFIG[env];
}
