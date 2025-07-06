#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { EmailLambdaCdkStack } from '../lib/email-lambda-cdk-stack';

const app = new cdk.App();
new EmailLambdaCdkStack(app, 'EmailLambdaCdkStack');
