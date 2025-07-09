import * as cdk from 'aws-cdk-lib';
import { EmailLambdaCdkStack } from '../lib/email-lambda-cdk-stack';
import { TemplateDeployStack } from '../lib/template-deploy-stack';


const app = new cdk.App();
new EmailLambdaCdkStack(app, 'EmailLambdaCdkStack');

new TemplateDeployStack(app, 'TemplateDeployStack', {
  bucketName: 'vcanteen-email-templates-bucket', 
});