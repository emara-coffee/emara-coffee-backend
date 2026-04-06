import './env';
import nodemailer, { Transporter } from 'nodemailer';

class EmailConfig {
  private transporter: Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: process.env.SMTP_USER,
        clientId: process.env.OAUTH_CLIENT_ID,
        clientSecret: process.env.OAUTH_CLIENT_SECRET,
        refreshToken: process.env.OAUTH_REFRESH_TOKEN,
      },
    });
  }

  private wrapHtml(subject: string, content: string): string {
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; padding: 40px 0;">
        <tr>
          <td align="center">
            <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
              <tr>
                <td style="background-color: #4A7C59; padding: 32px 40px; text-align: center;">
                  <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600;">${subject}</h1>
                </td>
              </tr>
              <tr>
                <td style="padding: 40px; text-align: center;">
                  <div style="color: #3E200C; font-size: 16px; line-height: 1.6;">
                    ${content}
                  </div>
                </td>
              </tr>
              <tr>
                <td style="background-color: #f1f5f9; padding: 24px 40px; text-align: center;">
                  <p style="color: #3E200C; font-size: 14px; margin: 0;">&copy; ${new Date().getFullYear()} Emara Coffee. All rights reserved.</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
    `;
  }

  async sendEmail(to: string, subject: string, htmlContent: string): Promise<void> {
    const mailOptions = {
      from: `"${process.env.FROM_NAME}" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html: this.wrapHtml(subject, htmlContent),
    };

    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Nodemailer OAuth2 Error:', error);
      throw error;
    }
  }

  async verifyConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      console.log('✅ Gmail OAuth2 connected successfully');
      return true;
    } catch (error) {
      console.error('Gmail OAuth2 connection failed:', error);
      return false;
    }
  }
}

export default new EmailConfig();