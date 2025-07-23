import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as iam from "aws-cdk-lib/aws-iam";
import * as s3deploy from "aws-cdk-lib/aws-s3-deployment";
import * as path from "path";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { RetentionDays } from "aws-cdk-lib/aws-logs";

interface EmailLambdaStackProps extends cdk.StackProps {
  envConfig: {
    bucketName: string;
    [key: string]: any;
  };
  envName: string;
}

export class EmailLambdaCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: EmailLambdaStackProps) {
    super(scope, id, props);

    const { bucketName } = props.envConfig;
    const { envName } = props;

    const templateBucket = new s3.Bucket(this, "EmailTemplateBucket", {
      bucketName,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    new s3deploy.BucketDeployment(this, "DeployTemplates", {
      destinationBucket: templateBucket,
      destinationKeyPrefix: "templates/",
      sources: [s3deploy.Source.asset(path.join(__dirname, `../templates/${props.envName}`))],
    });
    const emailLambda = new NodejsFunction(this, "EmailSenderLambda", {
      functionName: `email-sender-lambda-${envName}`,
      logRetention: RetentionDays.ONE_WEEK,
      entry: path.join(__dirname, "../lambda/send-email.ts"),
      handler: "handler",
      runtime: lambda.Runtime.NODEJS_18_X,
      environment: {
        TEMPLATE_BUCKET: bucketName,
        TEMPLATE_PATH: `templates/`,
        EMAIL_SENDER: props.envConfig.senderEmail
      },
    });

    templateBucket.grantRead(emailLambda);

    emailLambda.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ["ses:SendEmail", "ses:SendRawEmail"],
        resources: ["*"],
      })
    );

    new cdk.CfnOutput(this, "LambdaFunctionName", {
      value: emailLambda.functionName,
    });
  }
}
