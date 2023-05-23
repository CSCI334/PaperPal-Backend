import { injectable } from "inversify";
import { EmailConfig, MailOptions} from "@config/EmailConfig";
import nodemailer, { Transporter } from "nodemailer";

@injectable()
// Injectable EmailService, call @inject() on other files to use this service
export default class EmailService {
    // Creates a transporter object so that you only need to initialize it once through the whole application
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
                clientId: process.env.OAUTH_CLIENTID,
                clientSecret: process.env.OAUTH_CLIENT_SECRET,
                refreshToken: process.env.OAUTH_REFRESH_TOKEN,
            },
            tls: {
                rejectUnauthorized: false
            } 
        };
        // Creates a transporter using the values provided from .env 
        // Without a .env file, this file would not work at all, make sure to populate .env.template values and rename it to .env
        // (note: make a copy so git doesn't delete the original .env.template for everybody)
        this.transporter = nodemailer.createTransport(emailConfig);
    }

    // Sends an email
    async send(content: MailOptions) {
        console.log(process.env.ENVIRONMENT ?? "dev");
        if((process.env.ENVIRONMENT ?? "dev") === "prod") {
            this.transporter.sendMail(content, (error) => {
                if(error) console.log(error);
                else console.log("Email sent succesfully");
            });
        }
    }
}