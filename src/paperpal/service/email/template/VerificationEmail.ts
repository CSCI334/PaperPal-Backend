import { MailOptions } from "@config/EmailConfig";
import InvalidInputException from "@exception/InvalidInputException";
import Account from "@model/Account";

// Creates a template for verification email, returns all the email data like subject, body, recipient
export function createVerificationEmail(user: Account, token: string): MailOptions {  
    let domain = process.env.DOMAIN;
    if(domain === "localhost" || !domain) domain = "localhost:5173";

    if(user.accounttype === "REVIEWER") return createForReviewer(user, token, domain);
    if(user.accounttype === "CHAIR") return createForChair(user, token, domain);
    if(user.accounttype === "ADMIN") return createForAdmin(user, token, domain);
    if(user.accounttype === "AUTHOR") return createForAuthor(user, token, domain);
    throw new InvalidInputException("Unknown user type");
}

function createForChair(user: Account, token: string, domain: string): MailOptions {
    const recipientName = user.username;
    const recipient = user.email;
    const htmlLink = `http://${domain}/register-chair?token=${token}`;
    const emailSubject = `PaperPal Reviewer Invitation`;
    const emailBody = `
        <div style = 'width: 100%; font-family: helvetica, sans-serif;'>
            <div style = 'height: 100%;'>
                <table style = 'margin: 0 auto 0 auto'>
                    <br><tr><td style = 'text-align: center; font-size: 28px'>
                    <h2>Welcome ${recipientName}</h2>
                    </tr></tr>
                    <br><tr><td style = 'text-align: center; font-size: 22px'>
                    <h2>You've been Invited to join PaperPal as a Reviewer</h2>
                    </tr></tr>
                    </br></br><tr><td style = 'text-align: center; font-size: 16px'>
                    <p>Hey ${recipientName}. You have been selected to become a part of our team of Reviewers at PaperPal.</p>
                    </td></tr>
                    <tr><td style = 'text-align: center; font-size: 16px'>
                    <p>We have chosen you due to your exemplary work in the field of study we are currently reviewing papers for.</p>
                    </td></tr>
                    <tr><td style = 'text-align: center; font-size: 16px'>
                    <p>This, of course, would not prohibit you from submitting your own papers, but you would not be able to review your own paper.</p>
                    </td></tr>
                    <tr><td style = 'text-align: center; font-size: 16px'>
                    <p>If you desire you participate as both an author and a reviewer, you would be required to create an account for each role.</p>
                    </td></tr>
                    <tr><td style = 'text-align: center; font-size: 18px'>
                    </br><p>Please click <a href = '${htmlLink}' class = 'button'>here</a> to sign up as a reviewer.</p>
                    </td></tr>
                </table>
            </div>
        </div>`;

    console.log(`Verify email link for ${user.accounttype}: ${htmlLink}`);
    return {
        html: emailBody,
        subject: emailSubject,
        to: [recipient]
    };
}

function createForAdmin(user: Account, token: string, domain: string) : MailOptions{
    const recipientName = user.username;
    const recipient = user.email;
    const htmlLink = `http://${domain}/register-admin?token=${token}`;

    const emailSubject = `PaperPal Confirmation Email`;
    const emailBody = `
        <div style = 'width: 100%; font-family: helvetica, sans-serif;'>
            <div style = 'height: 100%;'>
                <table style = 'margin: 0 auto 0 auto'>
                    <br><tr><td style = 'text-align: center; font-size: 28px'>
                    <h2>Welcome ${recipientName}</h2>
                    </tr></tr>
                    </br></br><tr><td style = 'text-align: center; font-size: 16px'>
                    <p>Hey ${recipientName}. Thank you for registering to Paperpal.</p>
                    </td></tr>
                    <tr><td style = 'text-align: center; font-size: 18px'>
                    </br><p>Please click <a href = '${htmlLink}' class = 'button'>here</a> to confirm your account.</p>
                    </td></tr>
                </table>
            </div>
        </div>`;

        
    console.log(`Verify email link for ${user.accounttype}: ${htmlLink}`);
    return {
        html: emailBody,
        subject: emailSubject,
        to: [recipient]
    };
}

function createForAuthor(user: Account, token: string, domain: string) : MailOptions{
    const recipientName = user.username;
    const recipient = user.email;
    const htmlLink = `http://${domain}/verify-author?token=${token}`;

    const emailSubject = `PaperPal Confirmation Email`;
    const emailBody = `
        <div style = 'width: 100%; font-family: helvetica, sans-serif;'>
            <div style = 'height: 100%;'>
                <table style = 'margin: 0 auto 0 auto'>
                    <br><tr><td style = 'text-align: center; font-size: 28px'>
                    <h2>Welcome ${recipientName}</h2>
                    </tr></tr>
                    </br></br><tr><td style = 'text-align: center; font-size: 16px'>
                    <p>Hey ${recipientName}. Thank you for registering to Paperpal.</p>
                    </td></tr>
                    <tr><td style = 'text-align: center; font-size: 18px'>
                    </br><p>Please click <a href = '${htmlLink}' class = 'button'>here</a> to confirm your account.</p>
                    </td></tr>
                </table>
            </div>
        </div>`;

    console.log(`Verify email link for ${user.accounttype}: ${htmlLink}`);
    return {
        html: emailBody,
        subject: emailSubject,
        to: [recipient]
    };
}

function createForReviewer(user: Account, token: string, domain: string): MailOptions {
    const recipientName = user.username;
    const recipient = user.email;
    const htmlLink = `http://${domain}/register-reviewer?token=${token}`;

    const emailSubject = `PaperPal Reviewer Invitation`;
    const emailBody = `
        <div style = 'width: 100%; font-family: helvetica, sans-serif;'>
            <div style = 'height: 100%;'>
                <table style = 'margin: 0 auto 0 auto'>
                    <br><tr><td style = 'text-align: center; font-size: 28px'>
                    <h2>Welcome ${recipientName}</h2>
                    </tr></tr>
                    <br><tr><td style = 'text-align: center; font-size: 22px'>
                    <h2>You've been Invited to join PaperPal as a Reviewer</h2>
                    </tr></tr>
                    </br></br><tr><td style = 'text-align: center; font-size: 16px'>
                    <p>Hey ${recipientName}. You have been selected to become a part of our team of Reviewers at PaperPal.</p>
                    </td></tr>
                    <tr><td style = 'text-align: center; font-size: 16px'>
                    <p>We have chosen you due to your exemplary work in the field of study we are currently reviewing papers for.</p>
                    </td></tr>
                    <tr><td style = 'text-align: center; font-size: 16px'>
                    <p>This, of course, would not prohibit you from submitting your own papers, but you would not be able to review your own paper.</p>
                    </td></tr>
                    <tr><td style = 'text-align: center; font-size: 16px'>
                    <p>If you desire you participate as both an author and a reviewer, you would be required to create an account for each role.</p>
                    </td></tr>
                    <tr><td style = 'text-align: center; font-size: 18px'>
                    </br><p>Please click <a href = '${htmlLink}' class = 'button'>here</a> to sign up as a reviewer.</p>
                    </td></tr>
                </table>
            </div>
        </div>`;

    console.log(`Verify email link for ${user.accounttype}: ${htmlLink}`);
    return {
        html: emailBody,
        subject: emailSubject,
        to: [recipient]
    };
}