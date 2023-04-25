import { inject, injectable } from "inversify";
import jwt, { JwtPayload } from "jsonwebtoken";
import { SECRET } from "../../../config/Secret.js";
import Account from "../../../database/models/Account.js";
import InvalidInputException from "../../../exceptions/InvalidInputException.js";
import NotAuthenticatedException from "../../../exceptions/NotAuthenticatedException.js";
import AuthorRegisterDTO from "../../dto/AuthorRegisterDTO.js";
import InviteDTO from "../../dto/InviteDTO.js";
import LoginDTO from "../../dto/LoginDTO.js";
import VerifyEmailDTO from "../../dto/VerifyEmailDTO.js";
import AccountRepository from "../../repository/AccountRepository.js";
import AccountUtils from "./AccountUtils.js";

@injectable()
export default class AuthService {
    constructor(@inject(AccountRepository) private readonly accountRepository: AccountRepository) { }

    async register(registerDTO: AuthorRegisterDTO | InviteDTO) {
        // This is inelegant but it's better than the alternative.
        // Registering a new user uses the same logic for every user (who needs admin to invite them) except author (who can register on their own)
        
        // Rather than making three strategy consisting of different user roles with minute difference, we check if
        // the request provided a password or not.
        // If true, it's an author register, create their hashedPassword and salt, send verify email
        // If false, it's other account type, send verify email.
        const [hashedPassword, salt] = registerDTO.password ? 
            AccountUtils.createNewPasswordHash(registerDTO.password) :
            [null, null];
        
        const id: number = await this.accountRepository.insertUser({
            email : registerDTO.email,
            username: registerDTO.username,
            hashedpassword: hashedPassword,
            salt: salt,
            accounttype : registerDTO.accountType,
            accountstatus : "PENDING",
            conferenceid: registerDTO.conferenceId,
        });

        const jwtToken = AccountUtils.createUserJwtToken({
            uid: id, 
            email: registerDTO.email,
            accountType: registerDTO.accountType
        }, {expiresIn: "7d"});

        // Send verify email here, verify link should contain jwtToken and email

        // TODO: Not sure about this return
        return {
            token: jwtToken,
            email: registerDTO.email,
            username: registerDTO.username,
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
            uid: user.id,
            email: user.email,
            accountType: user.accounttype
        });

        return {
            token: jwtToken,
            email: user.email,
            username: user.username,
        };
    }

    async verifyEmail(verifyEmailDTO: VerifyEmailDTO) {
        const token = jwt.verify(verifyEmailDTO.token, SECRET.PRIVATE_KEY) as JwtPayload;
        if(!token.email) throw new NotAuthenticatedException("Invalid verification token");
        if(verifyEmailDTO.email !== token.email) throw new NotAuthenticatedException("Invalid verification token");

        this.accountRepository.updateAccountStatus(token.uid, "ACCEPTED");
        return {
            token : AccountUtils.createUserJwtToken({
                uid: token.uid, 
                email: token.email,
                accountType: token.accountType
            })
        };
    }

    async getUserData(id: number) {
        const user: Account = await this.accountRepository.getAccountById(id);
        return user;
    }

    async getAllReviewer() {
        const data = await this.accountRepository.getAllReviewer();
        return data;
    }
}
