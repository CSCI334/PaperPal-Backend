import { body, } from "express-validator";

export default class VerifyEmailDTO {

    constructor(
        public readonly email: string, 
        public readonly token: string,
        public readonly password: string,
    ) {}
    static validator = () => {
        return [
            body("email", "Email field does not exist").exists(),
            body("email", "Malformed email").isEmail().normalizeEmail(),
            body("token", "Token field does not exist").exists(),
            body("password", "Password field does not exist").exists(),
            body("password","Password field must contain at least 6 characters").isLength({ min: 6 }).escape(),
        ];
    }; 
}
