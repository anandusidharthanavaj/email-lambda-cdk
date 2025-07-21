#  Email Lambda CDK

This project uses **AWS CDK (TypeScript)** to deploy a Lambda function that sends dynamic emails using **AWS SES** and HTML templates stored in **S3**.

---

##  Features

- Sends templated HTML emails via AWS SES.
- Templates are stored in S3 and dynamically rendered by Lambda.
- Lambda is triggered programmatically (e.g., from a NestJS service).
- Uses CDK to manage the full infrastructure as code.

---

##  Stack Includes

- **Lambda Function** (Node.js)
- **S3 Bucket** (for storing email templates)
- **SES Integration**
- **CDK Deployment Configurations**

---


```bash
email-lambda-cdk/
├── lambda/                  # Lambda function code (send-email.ts)
├── templates/               # HTML email templates
├── lib/                     # CDK Stack definition
├── bin/                     # CDK entry point
├── cdk.json
└── README.md


For adding new template:

Steps of new template: 

/templates/welcome-user.html

RUN this comand for deploy template in s3:

cdk deploy TemplateDeployStack


To send mail from any service:

Need to add this dependency: npm install aws-sdk



import this in file: import * as AWS from 'aws-sdk';


sample code:
const lambda = new AWS.Lambda({ region: 'ap-south-1' });

const response1 = await lambda.invoke({
  FunctionName: 'email-sender-lambda',
  InvocationType: 'RequestResponse', // get actual result
  Payload: JSON.stringify({
    to: ['anandubecse@gmail.com'],
    subject: 'Welcome Back!',
    templateKey: 'password-reset.html',
    replacements: {
      name: 'Anandu'
    },
  }),
}).promise();