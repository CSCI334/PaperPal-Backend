import { body, } from "express-validator";

export default class LoginDTO {
    constructor(public readonly email: string, public readonly password: string) {}
    
    static validator = () => {
        return [
            body("email", "Email field does not exist").exists().normalizeEmail(),
            body("password", "Password field does not exist").exists(),
        ];
    };
}
