import { check } from "express-validator";
import { AccountType } from "../../../database/models/Account.js";
import RegisterDTO from "./RegisterDTO.js";

export default class SignUpDTO extends RegisterDTO {

    constructor(
        public readonly email: string, 
        public readonly username: string, 
        public readonly password: string, 
        public readonly accountType: AccountType = "AUTHOR",
        public readonly conferenceId: number) {
        super(email, username, password, accountType, conferenceId);
    }
    static validator = [
        ...RegisterDTO.validator,
        check("password", "Password field does not exist").exists(),
        check("password","Password field must contain at least 6 characters").isLength({ min: 6 }),
    ];
}
