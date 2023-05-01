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
        if(registerDTO.accountType === "AUTHOR") this.sendVerificationEmail(jwtToken);

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

    async sendVerificationEmail(jwtToken : string) {
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
