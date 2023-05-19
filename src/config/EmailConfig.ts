
export type MailOptions = {
    to : string,
    subject : string,
    html : string
}

export type EmailConfig = {
    host: string,
    port: number,
    secure: boolean,
    service: string,
    auth: {
        type: "OAUTH2",
        user: string | undefined,
        clientId: string | undefined,
        clientSecret: string | undefined,
        refreshToken: string | undefined,
    },
    tls: {
        rejectUnauthorized: false
    } 
};

export const emailConfig = {
    host: "smtp.gmail.com",
    port: 587,
    secure: true,
    service: "gmail",
    auth: {
        type: "OAuth2",
        user: process.env.EMAIL_USER,
        clientId: process.env.OAUTH_CLIENTID,
        clientSecret: process.env.OAUTH_CLIENT_SECRET,
        refreshToken: process.env.OAUTH_REFRESH_TOKEN,
    },
    tls: {
        rejectUnauthorized: false
    } 
};