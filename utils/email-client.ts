import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

export class EmailClient {
  private ses: SESClient;
  private sender: string;

  constructor(region: string, sender: string) {
    this.ses = new SESClient({ region });
    this.sender = sender;
  }

  async sendEmail(to: string, subject: string, htmlBody: string) {

    console.log('Sending email with the following details:');
  console.log('From:', this.sender);
  console.log('To:', to);
  console.log('Subject:', subject);
  console.log('HTML Body Length:', htmlBody?.length || 0);
    const command = new SendEmailCommand({
      Source: this.sender,
      Destination: { ToAddresses: [to] },
      Message: {
        Subject: { Data: subject },
        Body: {
          Html: { Data: htmlBody }
        }
      }
    });
    return this.ses.send(command);
  }
}
