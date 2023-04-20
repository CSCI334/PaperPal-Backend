import { createHash, randomBytes } from "crypto";
import { inject, injectable } from "inversify";
import jwt from "jsonwebtoken";
import { SECRET } from "../../config/Secret.js";
import Account from "../../database/models/Account.js";
import InvalidInputException from "../../exceptions/InvalidInputException.js";
import LoginDTO from "../dto/LoginDTO.js";
import SignUpDTO from "../dto/SignUpDTO.js";
import AuthRepository from "../repository/AuthRepository.js";

@injectable()
export default class AuthService {
    constructor(@inject(AuthRepository) private readonly authRepository: AuthRepository) { }

    async signUp(signupDto: SignUpDTO) {
        const [hashedPassword, salt] = this.createNewPasswordHash(
            signupDto.password
        );

        const id: number = await this.authRepository.insertUser(
            signupDto.email,
            signupDto.username,
            hashedPassword,
            salt,
            signupDto.userType
        );

        const jwtToken = jwt.sign({ uid: id }, SECRET.PRIVATE_KEY, {
            expiresIn: "1d",
        });
        return {
            token: jwtToken,
            email: signupDto.email,
            username: signupDto.username,
        };
    }

    async login(loginDTO: LoginDTO) {
        // Authenticate them here by checking if their input = hash
        const user: Account = await this.authRepository.getUserByEmail(loginDTO.email);
        if (!user) throw new InvalidInputException("Invalid login credentials");
        if (this.createPasswordHash(loginDTO.password, user.salt) !== user.hashedpassword)
            throw new InvalidInputException("Invalid login credentials");

        const jwtToken = jwt.sign({ uid: user.id }, SECRET.PRIVATE_KEY, {
            expiresIn: "1d",
        });

        return {
            token: jwtToken,
            email: user.email,
            username: user.username,
        };
    }

    async getUserData(id: number) {
        const user: Account = await this.authRepository.getUserById(id);
        return user;
    }

    createPasswordHash(password: string, salt: string) {
        const hashedPassword = this.createHashFromString(
            this.createHashFromString(password) + salt
        );
        return hashedPassword;
    }

    createNewPasswordHash(password: string): [string, string] {
        const salt = randomBytes(3).toString("hex");
        const hashedPassword = this.createPasswordHash(password, salt);
        return [hashedPassword, salt];
    }

    createHashFromString(input: string): string {
        const hash = createHash("sha256").update(input).digest("hex");
        return hash;
    }
}
