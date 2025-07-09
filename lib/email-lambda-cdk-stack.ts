import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import * as path from 'path';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';

export class EmailLambdaCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const templateBucket = new s3.Bucket(this, 'EmailTemplateBucket', {
      bucketName: 'vcanteen-email-templates-bucket',
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    new s3deploy.BucketDeployment(this, 'DeployTemplates', {
      destinationBucket: templateBucket,
      sources: [s3deploy.Source.asset('./templates')],
    });

    const emailLambda = new NodejsFunction(this, 'EmailSenderLambda', {
      functionName: 'email-sender-lambda',
      entry: path.join(__dirname, '../lambda/send-email.ts'),
      handler: 'handler',
      runtime: lambda.Runtime.NODEJS_18_X,
      environment: {
        TEMPLATE_BUCKET: templateBucket.bucketName,
      },
    });

    templateBucket.grantRead(emailLambda);

    emailLambda.addToRolePolicy(new iam.PolicyStatement({
      actions: ['ses:SendEmail', 'ses:SendRawEmail'],
      resources: ['*'],
    }));

    new cdk.CfnOutput(this, 'LambdaFunctionName', {
      value: emailLambda.functionName,
    });
  }
}
