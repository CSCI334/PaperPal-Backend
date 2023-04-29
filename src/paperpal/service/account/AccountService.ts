import AccountRepository from "@app/paperpal/repository/AccountRepository";
import { TokenData } from "@app/paperpal/types/TokenData";
import AuthorRegisterDTO from "@app/paperpal/types/dto/AuthorRegisterDTO";
import InviteDTO from "@app/paperpal/types/dto/InviteDTO";
import LoginDTO from "@app/paperpal/types/dto/LoginDTO";
import RegisterDTO from "@app/paperpal/types/dto/RegisterDTO";
import VerifyEmailDTO from "@app/paperpal/types/dto/VerifyEmailDTO";
import { SECRET } from "@config/Secret";
import InvalidInputException from "@exception/InvalidInputException";
import NotAuthenticatedException from "@exception/NotAuthenticatedException";
import NotFoundException from "@exception/NotFoundException";
import Account from "@model/Account";
import AccountUtils from "@service/account/AccountUtils";
import { inject, injectable } from "inversify";
import jwt from "jsonwebtoken";


@injectable()
export default class AuthService {
    constructor(@inject(AccountRepository) private readonly accountRepository: AccountRepository) { }

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
        
        const user: Account = await this.accountRepository.insertUser({
            email : registerDTO.email,
            username: registerDTO.username,
            hashedpassword: hashedPassword,
            salt: salt,
            accounttype : registerDTO.accountType,
            accountstatus : "PENDING",
            conferenceid: registerDTO.conferenceId,
        });

        const jwtToken = AccountUtils.createUserJwtToken({
            accountId: user.id, 
            email: registerDTO.email,
            accountType: registerDTO.accountType,
            conferenceId: registerDTO.conferenceId
        }, {expiresIn: "7d"});

        // Send verify email here, verify link should contain jwtToken and email
        if(registerDTO.accountType === "AUTHOR") this.sendVerificationEmail(jwtToken);


        // TODO: Not sure about this return
        return {
            token: jwtToken,
        };
    }

    async login(loginDTO: LoginDTO) {
        // Authenticate them here by checking if their input = hash
        const user: Account = await this.accountRepository.getAccountByEmail(loginDTO.email);
        if (!user) throw new InvalidInputException("Invalid login credentials");
        if (AccountUtils.createPasswordHash(loginDTO.password, user.salt) !== user.hashedpassword)
            throw new InvalidInputException("Invalid login credentials");
        if (user.accountstatus === "PENDING")
            throw new NotAuthenticatedException("Email is not verified");

        const jwtToken = AccountUtils.createUserJwtToken({
            accountId: user.id,
            email: user.email,
            accountType: user.accounttype,
            conferenceId: user.conferenceid
        });

        return {
            token: jwtToken,
        };
    }

    async sendVerificationEmail(jwtToken : string) {
        return;
    }

    async verifyEmail(verifyEmailDTO: VerifyEmailDTO) {
        const token = jwt.verify(verifyEmailDTO.token, SECRET.PRIVATE_KEY) as TokenData;
        if(!token.email) throw new NotAuthenticatedException("Invalid verification token");
        if(verifyEmailDTO.email !== token.email) throw new NotAuthenticatedException("Invalid verification token");

        this.accountRepository.updateAccountStatus(token.accountId, "ACCEPTED");
        this.setUserPassword(verifyEmailDTO.password, token.accountId);

        return {
            token : AccountUtils.createUserJwtToken({
                accountId: token.accountId, 
                email: token.email,
                accountType: token.accountType,
                conferenceId: token.conferenceId
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
}
