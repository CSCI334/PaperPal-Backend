import { MailOptions } from "@config/EmailConfig";
import Conference from "@model/Conference";

// Creates a template for verification email, returns all the email data like subject, body, recipient
export function createAnnouncementEmail(
    conference: Conference, 
    recipientList: string[],
    acceptedPapers: string[],
    rejectedPapers: string[]
): MailOptions { 
    return createTemplate(conference, recipientList, acceptedPapers, rejectedPapers);
}

function createTemplate(
    conference: Conference, 
    recipientList: string[], 
    acceptedPapers: string[],
    rejectedPapers: string[]
): MailOptions {
    const conferenceName = conference.conferencename;

    let acceptedPaperHtml = ``;
    for(const i of acceptedPapers) {
        acceptedPaperHtml += `<li>${i}</li>`;
    }

    let rejectedPaperHtml = ``;
    for(const i of rejectedPapers) {
        rejectedPaperHtml += `<li>${i}</li>`;
    }

    const emailSubject = `Paperpal: ${conferenceName} result announcement`;
    const emailBody = `
    <div style = 'width: 100%; font-family: helvetica, sans-serif;'>
        <div style = 'height: 100%;'>
            <table style = 'margin: 0 auto 0 auto'>
                <br><tr><td style = 'text-align: center; font-size: 28px'>
                <h6>We hope this email finds you well</h6>
                </tr></tr>
                <br><tr><td style = 'text-align: center; font-size: 22px'>
                <h6>We are here to announce the result of '${conferenceName}'</h6>
                </tr></tr>
                </br></br><tr><td style = 'text-align: left; font-size: 16px'>
                <p>Below is the list of accepted papers :</p>
                <ul>
                    ${acceptedPaperHtml}
                </ul>
                </td></tr>
                <tr><td style = 'text-align: left; font-size: 16px'>
                <p>Below is the list of rejected papers:</p>
                <ul>
                    ${rejectedPaperHtml}
                </ul>
                </td></tr>
                <tr><td style = 'text-align: center; font-size: 18px'>
                </br><p>We thank you for your participation</p>
                </td></tr>
            </table>
        </div>
    </div>`;

    return {
        html: emailBody,
        subject: emailSubject,
        to: recipientList
    };
}
