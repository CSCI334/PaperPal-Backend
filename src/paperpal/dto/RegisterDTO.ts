import { check } from "express-validator";
import { AccountType } from "../../database/models/Account.js";

export default abstract class RegisterDTO {
    constructor(
        public readonly email: string, 
        public readonly username: string, 
        public readonly password: string, 
        public readonly accountType: AccountType,
        public readonly conferenceId : number) {}
    static validator = [
        check("email", "Email field does not exist").exists(),
        check("email", "Malformed email").isEmail().normalizeEmail(),
        check("username", "Username field does not exist").exists(),
        check("accountType", "accountType field does not exist").exists(),
        check("accountType", "accountType field is invalid. Value can only be ADMIN, CHAIR, REVIEWER, or AUTHOR").isIn([
            "ADMIN", "CHAIR", "REVIEWER", "AUTHOR"
        ]),
        check("conferenceId", "conferenceID field does not exist").exists(),
    ];
}