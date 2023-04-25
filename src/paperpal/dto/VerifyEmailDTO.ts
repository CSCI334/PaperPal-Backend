import { check } from "express-validator";

export default class VerifyEmailDTO {

    constructor(
        public readonly email: string, 
        public readonly token: string,
        public readonly password: string,
    ) {}
    static validator = [
        check("email", "Email field does not exist").exists(),
        check("email", "Malformed email").isEmail().normalizeEmail(),
        check("token", "Token field does not exist").exists(),
        check("password", "Password field does not exist").exists(),
        check("password","Password field must contain at least 6 characters").isLength({ min: 6 }),
    ];
}
