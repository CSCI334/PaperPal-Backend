import { MailOptions } from "@config/EmailConfig";
import Account from "@model/Account";

// Creates a template for verification email, returns all the email data like subject, body, recipient
// I made this just for author, you might want to add some extra conditions on all the other user types
export function createVerificationEmail(user: Account): MailOptions {
    const recipientName = user.email;
    const htmlLink = "fakelink";
    const emailSubject = `PaperPal ${user.accounttype.toLowerCase()} Invitation`;
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
    return {
        html: emailBody,
        subject: emailSubject,
        to: recipientName
    };
}
