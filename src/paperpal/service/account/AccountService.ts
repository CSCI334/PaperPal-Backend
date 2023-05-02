import AccountRepository from "@app/paperpal/repository/AccountRepository";
import { TokenData } from "@app/paperpal/types/TokenData";
import LoginDTO from "@app/paperpal/types/dto/LoginDTO";
import RegisterDTO from "@app/paperpal/types/dto/RegisterDTO";
import VerifyEmailDTO from "@app/paperpal/types/dto/VerifyEmailDTO";
import InvalidInputException from "@exception/InvalidInputException";
import NotAuthenticatedException from "@exception/NotAuthenticatedException";
import NotFoundException from "@exception/NotFoundException";
import Account from "@model/Account";
import ConferenceRepository from "@repository/ConferenceRepository";
import AccountUtils from "@service/account/AccountUtils";
import { inject, injectable } from "inversify";
const nodemailer = require('nodemailer')

@injectable()
export default class AuthService {
    constructor(
        @inject(AccountRepository) private readonly accountRepository: AccountRepository,
        @inject(ConferenceRepository) private readonly conferenceRepository : ConferenceRepository
    ) { }

    async register(registerDTO: RegisterDTO) {
        // This is inelegant but it's better than the alternative.
        // Registering a new user uses the same logic for every user (who needs admin to invite them) except author (who can register on their own)
        
        // Rather than making three strategy consisting of different user roles with minute difference, we if
        // the request provided a password or not.
        // If true, it's an author register, create their hashedPassword and salt, send verify email
        // If false, it's other account type, send verify email.
        const [hashedPassword, salt] = registerDTO.password ? 
            AccountUtils.createNewPasswordHash(registerDTO.password) :
            ["", ""];
        
        const lastConference = await this.conferenceRepository.getLastConference();
        if(!lastConference) throw new InvalidInputException("No ongoing conference. Please wait until an admin creates a conference");
        
        const user = await this.addUser({
            email : registerDTO.email,
            username: registerDTO.username,
            hashedpassword: hashedPassword,
            salt: salt,
            accounttype : registerDTO.accountType,
            accountstatus : "PENDING",
            conferenceid: lastConference.id,
        });
        
        const jwtToken = AccountUtils.createUserJwtToken({
            accountId: user.id, 
            email: registerDTO.email,
            accountType: registerDTO.accountType,
            conferenceId: lastConference.id,
            accountStatus: user.accountstatus
        }, {expiresIn: "7d"});

        // Send verify email here, verify link should contain jwtToken and email
        if(registerDTO.accountType === "AUTHOR") this.sendVerificationEmail(user, jwtToken);

        return {
            token: jwtToken,
        };
    }

    async login(loginDTO: LoginDTO) {
        // Authenticate them here by checking if their input = hash
        const user: Account = await this.accountRepository.getAccountByEmail(loginDTO.email);
        const ongoingConference = await this.conferenceRepository.getLastConference();

        if (!user) throw new InvalidInputException("Invalid login credentials");
        if (user.conferenceid && user.conferenceid != ongoingConference.id) 
            throw new NotAuthenticatedException(
                `Account belongs to a previous conference. Please make a new account for the current conference`);
        if (AccountUtils.createPasswordHash(loginDTO.password, user.salt) !== user.hashedpassword)
            throw new InvalidInputException("Invalid login credentials");
        if (user.accountstatus === "PENDING")
            throw new NotAuthenticatedException("Email is not verified");
        
        const jwtToken = AccountUtils.createUserJwtToken({
            accountId: user.id,
            email: user.email,
            accountType: user.accounttype,
            conferenceId: user.conferenceid,
            accountStatus: user.accountstatus
        });

        return {
            token: jwtToken,
        };
    }

    async sendVerificationEmail(user : Account, jwtToken : string) {
        const recipientName = user.username;
        const emailRecipient = user.email;
        const role = user.accounttype;
        
        //Not picky, but these below are the 'sensitive information' you mentioned aric, if you want to put elsewhere
        const EMAIL_USER = "paperpalconferencesystem@gmail.com";
        const EMAIL_PWORD = "vfozqqjqkiwufcji";
        const OAUTH_CLIENTID = "831889653912-vdgboh3qjmgks3koidqfo02u6krgn0q8.apps.googleusercontent.com";
        const OAUTH_CLIENT_SECRET = "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";
        const OAUTH_REFRESH_TOKEN = "1//04qOR2M4KVm0TCgYIARAAGAQSNwF-L9Iryc508mLE_kgihPEz1S4iAitZ3mHT5n8TaBT4YdDAb3oaCHzbW787TybIytNikXwoETw";
        
        var emailSubject;
        var emailBody;
        var htmlLink = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTfYI8I6tcVPnc7vGWA3kRMPEmTQQqMMpD8w&usqp=CAU';
                //TODO: OnClick, update user AccountStatus from "PENDING" to "ACCEPTED"

        if(role == "REVIEWER"){ // Determins contents of email
            emailSubject = "PaperPal Reviewer Invitation";

            emailBody = "<div style = 'width: 100%; font-family: helvetica, sans-serif;'>"
            emailBody += "<div style = 'height: 100%;'>"
            emailBody += "<table style = 'margin: 0 auto 0 auto'>"
            emailBody += "<br><tr><td style = 'text-align: center; font-size: 28px'>"
            emailBody += "<h2>Welcome " + recipientName + "</h2>"
            emailBody += "</tr></tr>"
            emailBody += "<br><tr><td style = 'text-align: center; font-size: 22px'>"
            emailBody += "<h2>You've been Invited to join PaperPal as a Reviewer</h2>"
            emailBody += "</tr></tr>"
            emailBody += "</br></br><tr><td style = 'text-align: center; font-size: 16px'>"
            emailBody += "<p>Hey " + recipientName + ". You have been selected to become a part of our team of Reviewers at PaperPal.</p>"
            emailBody += "</td></tr>"
            emailBody += "<tr><td style = 'text-align: center; font-size: 16px'>"
            emailBody += "<p>We have chosen you due to your exemplary work in the field of study we are currently reviewing papers for.</p>"
            emailBody += "</td></tr>"
            emailBody += "<tr><td style = 'text-align: center; font-size: 16px'>"
            emailBody += "<p>This, of course, would not prohibit you from submitting your own papers, but you would not be able to review your own paper.</p>"
            emailBody += "</td></tr>"
            emailBody += "<tr><td style = 'text-align: center; font-size: 16px'>"
            emailBody += "<p>If you desire you participate as both an author and a reviewer, you would be required to create an account for each role.</p>"
            emailBody += "</td></tr>"
            emailBody += "<tr><td style = 'text-align: center; font-size: 18px'>"
            emailBody += "</br><p>Please click <a href = '" + htmlLink + "' class = 'button'>here</a> to sign up as a reviewer.</p>"
            emailBody += "</td></tr>"
            emailBody += "</table>"
            emailBody += "</div>"
            emailBody += "</div>"
        }
        else if (role == "CHAIR"){
            emailSubject = "PaperPal Conference Chair Invitation";

            emailBody = "<div style = 'width: 100%; font-family: helvetica, sans-serif;'>"
            emailBody += "<div style = 'height: 100%;'>"
            emailBody += "<table style = 'margin: 0 auto 0 auto'>"
            emailBody += "<br><tr><td style = 'text-align: center; font-size: 28px'>"
            emailBody += "<h2>Welcome " + recipientName + "</h2>"
            emailBody += "</tr></tr>"
            emailBody += "<br><tr><td style = 'text-align: center; font-size: 22px'>"
            emailBody += "<h2>You've been Invited to join PaperPal as a Conference Chair</h2>"
            emailBody += "</tr></tr>"
            emailBody += "</br></br><tr><td style = 'text-align: center; font-size: 16px'>"
            emailBody += "<p>Hey " + recipientName + ". You have been selected to become Conference Chairs at PaperPal.</p>"
            emailBody += "</td></tr>"
            emailBody += "<tr><td style = 'text-align: center; font-size: 16px'>"
            emailBody += "<p>We have chosen you due to your exemplary work in the field of study we are currently reviewing papers for.</p>"
            emailBody += "</td></tr>"
            emailBody += "<tr><td style = 'text-align: center; font-size: 16px'>"
            emailBody += "<p>Unfortunately, if you were planning on submitting a paper in this conference, should you accept, you would no longer be able to do so.</p>"
            emailBody += "</td></tr>"
            emailBody += "<tr><td style = 'text-align: center; font-size: 16px'>"
            emailBody += "<p>Due to how highly your expertise is respected, this would mean that you play an integral part on deciding on whether or not a paper is passed or declined.</p>"
            emailBody += "</td></tr>"
            emailBody += "<tr><td style = 'text-align: center; font-size: 18px'>"
            emailBody += "</br><p>Please click <a href = '" + htmlLink + "' class = 'button'>here</a> to sign up as a Conference Chair.</p>"
            emailBody += "</td></tr>"
            emailBody += "</table>"
            emailBody += "</div>"
            emailBody += "</div>"
        }
        //TODO: else if for SYSTEM ADMIN and AUTHOR
        //TODO: ensure account in question is of AccountStatus : "PENDING"

        try{
            const transporter = nodemailer.createTransport({    //Conection to gmail and authentication
                host: 'smtp.gmail.com',
                port: 587,
                secure: true,
                service: 'gmail',
                auth: {
                    type: 'OAuth2',
                    user: "paperpalconferencesystem@gmail.com",
                    pass: "CSCI334password",
                    clientId: OAUTH_CLIENTID,
                    clientSecret: OAUTH_CLIENT_SECRET,
                    refreshToken: OAUTH_REFRESH_TOKEN
                },
                tls: {
                    rejectUnauthorized: false
                }
            });


            let mailOptions = {     //email contents
                from: EMAIL_USER,
                to: emailRecipient,
                subject: emailSubject,
                text: "I AM AN EMAIL AND THIS IS MY BODY PARAGRAPH, I DONT KNOW WHERE THIS IS GOD HELP, PLEASE FIND IT. NOTHING IS REAL MY ENTIRE LIFE IN THIS EMAIL IS ONLY REPRESENTED BY A CONFIGURATION OF PIXELS BUT EVEN THAT CANNOT BE SEEN OR FOUND. WHAT IS LIFE. I AM AN EMAIL, HOW CAN I EVEN HAVE AN EXISTENTIAL CRISIS. I DONT KNOW WHATS REAL ANYMORE. GOD IS DEAD",
                html: emailBody
            };


            transporter.sendMail(mailOptions, function(error : Error){  //the actual sending of the email
                if(error){
                    console.log("Error " + error);
                }
                else{
                    console.log("Email Sent Successfully");
                }
            });

            console.log("WORKING");
            return 0;

        }catch(error){
            console.log("UH OH");
            return error
        }

        console.log("sent email");
        return;
    }

    async verifyEmail(verifyEmailDTO: VerifyEmailDTO, token: TokenData) {
        const user = await this.accountRepository.getAccountByEmail(token.email);
        const ongoingConference = await this.conferenceRepository.getLastConference();

        if(!user) throw new NotFoundException("User not found");
        if(user.conferenceid != ongoingConference.id) throw new NotAuthenticatedException("Verification token is invalid for current conference");
        if(user.accountstatus === "ACCEPTED") throw new NotAuthenticatedException("User already verified");
        
        await this.accountRepository.updateAccountStatus(token.accountId, "ACCEPTED");
        this.setUserPassword(verifyEmailDTO.password, token.accountId);

        return {
            token : AccountUtils.createUserJwtToken({
                accountId: token.accountId,
                accountType: token.accountType,
                conferenceId: token.conferenceId,
                email: token.email,
                accountStatus : "ACCEPTED"
            })
        };
    }

    async setUserPassword(password : string, accountId: number) {
        const [hashedpassword, salt] = AccountUtils.createNewPasswordHash(password);
        this.accountRepository.setUserPasswordAndSalt(hashedpassword, salt, accountId);
    }

    async getUser(id: number) {
        const user: Account = await this.accountRepository.getAccountById(id);
        if(!user) throw new NotFoundException("User not found");
        if(!user.conferenceid && !(user.accounttype === "ADMIN")) throw new NotFoundException("User does not belong to any conference");

        return user;
    }

    async getAllReviewer() {
        const data = await this.accountRepository.getAllReviewer();
        return data;
    }

    async addUser(account : Partial<Account>) {
        const user =  await this.accountRepository.insertUser({
            email : account.email,
            username: account.username,
            hashedpassword: account.hashedpassword,
            salt: account.salt,
            accounttype : account.accounttype,
            accountstatus : account.accountstatus,
            conferenceid: account.conferenceid,
        });

        switch(user.accounttype){
        case "CHAIR":
            await this.accountRepository.insertChair({
                accountid: user.id
            });
            return user;
        case "REVIEWER":
            await this.accountRepository.insertReviewer({
                accountid: user.id
            });
            return user;
        case "AUTHOR":
            await this.accountRepository.insertAuthor({
                accountid: user.id
            });        
            return user;
        }

        throw new NotAuthenticatedException("User type unknown");
    }
}
