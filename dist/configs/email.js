"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("./env");
const nodemailer_1 = __importDefault(require("nodemailer"));
class EmailConfig {
    constructor() {
        this.transporter = nodemailer_1.default.createTransport({
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT || '587'),
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
            tls: {
                rejectUnauthorized: false,
            },
        });
    }
    async sendEmail(to, subject, html) {
        const mailOptions = {
            from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
            to,
            subject,
            html,
        };
        await this.transporter.sendMail(mailOptions);
    }
    async verifyConnection() {
        try {
            await this.transporter.verify();
            console.log('✅ Email service connected successfully');
            return true;
        }
        catch (error) {
            console.error('Email service connection failed:', error);
            return false;
        }
    }
}
exports.default = new EmailConfig();
//# sourceMappingURL=email.js.map