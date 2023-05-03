import { injectable } from "inversify";
import { EmailConfig, MailOptions} from "@config/EmailConfig";
import nodemailer, { Transporter } from "nodemailer";

@injectable()
export default class EmailService {
    private readonly transporter: Transporter;
    constructor() {
        const emailConfig : EmailConfig = {
            host: "smtp.gmail.com",
            port: 587,
            secure: true,
            service: "gmail",
            auth: {
                type: "OAUTH2",
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PWORD,
                clientId: process.env.OAUTH_CLIENTID,
                clientSecret: process.env.OAUTH_CLIENT_SECRET,
                refreshToken: process.env.OAUTH_REFRESH_TOKEN,
            },
            tls: {
                rejectUnauthorized: false
            } 
        };
        this.transporter = nodemailer.createTransport(emailConfig);
    }
    async send(content: MailOptions) {
        this.transporter.sendMail(content);
    }
}