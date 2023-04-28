import { createHash, randomBytes } from "crypto";
import { SECRET } from "../../../config/Secret.js";
import jwt from "jsonwebtoken";
import { Locals } from "express";
import { TokenData } from "../../types/TokenData.js";

export default class AccountUtils {
    public static createPasswordHash(password: string, salt: string) {
        const hashedPassword = this.createHashFromString(
            this.createHashFromString(password) + salt
        );
        return hashedPassword;
    }

    public static createNewPasswordHash(password: string): [string, string] {
        const salt = randomBytes(3).toString("hex");
        const hashedPassword = this.createPasswordHash(password, salt);
        return [hashedPassword, salt];
    }

    public static createHashFromString(input: string): string {
        const hash = createHash("sha256").update(input).digest("hex");
        return hash;
    }

    public static createUserJwtToken(locals : TokenData, options: jwt.SignOptions = {expiresIn : "3d"} ) {
        const jwtToken = jwt.sign(locals, SECRET.PRIVATE_KEY, options);
        return jwtToken;
    }
}