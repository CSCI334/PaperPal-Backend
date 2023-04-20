import { check } from "express-validator";

export default class SignUpDTO {

    constructor(
        public readonly email: string, 
        public readonly username: string, 
        public readonly password: string, 
        public readonly userType: string) {}
    static validator = [
        check("email", "Email field does not exist").exists(),
        check("email", "Malformed email").isEmail().normalizeEmail(),
        check("username", "Username field does not exist").exists(),
        check("password", "Password field does not exist").exists(),
        check("password","Password field must contain at least 6 characters").isLength({ min: 6 }),
        check("userType", "userType field does not exist").exists(),
    ];
}
