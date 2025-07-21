import * as cdk from 'aws-cdk-lib';
import { EmailLambdaCdkStack } from '../lib/email-lambda-cdk-stack';
import { TemplateDeployStack } from '../lib/template-deploy-stack';

const app = new cdk.App();
const config = require('config');


// Get environment from context or fallback to 'dev'
const envName = app.node.tryGetContext('env') || 'dev';
const envConfig = config.util.toObject(config); // Convert Config chain to plain object
console.log('ENV CONFIG:', envName);
console.log('ENV CONFIG:', envConfig);
// Example: pass config values to stacks
new EmailLambdaCdkStack(app, `EmailLambdaCdkStack-${envName}`, {
  envConfig,
  envName,
  env: {
    account: envConfig.account,
    region: envConfig.region
  }
});
if (!envConfig.bucketName) {
  throw new Error("Missing 'bucketName' in config for environment: " + envName);
}
new TemplateDeployStack(app, `TemplateDeployStack-${envName}`, {
  bucketName: envConfig.bucketName,
  env: {
    account: envConfig.account,
    region: envConfig.region
  },
  envName: envName,
});
