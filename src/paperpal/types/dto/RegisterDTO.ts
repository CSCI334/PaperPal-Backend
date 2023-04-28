import { body } from "express-validator";
import { AccountType } from "../../../database/models/Account.js";

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
            body("accountType", "accountType field does not exist").exists(),
            body("accountType", "accountType field is invalid. Value can only be ADMIN, CHAIR, REVIEWER, or AUTHOR").isIn([
                "ADMIN", "CHAIR", "REVIEWER", "AUTHOR"
            ]),
            body("conferenceId", "conferenceID field does not exist").exists(),
        ];
    };    
}