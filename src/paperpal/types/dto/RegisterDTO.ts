import { AccountType } from "@model/Account";
import { body } from "express-validator";

export default abstract class RegisterDTO {
    constructor(
        public readonly email: string, 
        public readonly username: string, 
        public readonly password: string, 
        public readonly accountType: AccountType,
        public readonly conferenceId : number) {}

    static validator = () => {
        return [
            body("email", "Email field does not exist").exists(),
            body("email", "Malformed email").isEmail().normalizeEmail(),
            body("username", "Username field does not exist").exists().escape(),
            body("conferenceId", "conferenceID field does not exist").exists(),
        ];
    };    
}