import './env';
declare class EmailConfig {
    private transporter;
    constructor();
    sendEmail(to: string, subject: string, html: string): Promise<void>;
    verifyConnection(): Promise<boolean>;
}
declare const _default: EmailConfig;
export default _default;
//# sourceMappingURL=email.d.ts.map