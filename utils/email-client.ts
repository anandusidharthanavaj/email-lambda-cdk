import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

export class EmailClient {
  private ses: SESClient;
  private sender: string;

  constructor(region: string, sender: string) {
    this.ses = new SESClient({ region });
    this.sender = sender;
  }

  async sendEmail(to: string, subject: string, htmlBody: string) {
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
