import './env';
declare class EmailConfig {
    private transporter;
    constructor();
    private wrapHtml;
    sendEmail(to: string, subject: string, htmlContent: string): Promise<void>;
    verifyConnection(): Promise<boolean>;
}
declare const _default: EmailConfig;
export default _default;
//# sourceMappingURL=email.d.ts.map