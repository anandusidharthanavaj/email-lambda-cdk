import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';

export interface TemplateDeployProps extends cdk.StackProps {
  bucketName: string;
}

export class TemplateDeployStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: TemplateDeployProps) {
    super(scope, id, props);

    const templateBucket = s3.Bucket.fromBucketName(
      this,
      'ExistingTemplateBucket',
      props.bucketName,
    );

    new s3deploy.BucketDeployment(this, 'DeployNewTemplates', {
      destinationBucket: templateBucket,
      sources: [s3deploy.Source.asset('./templates')],
    });
  }
}
