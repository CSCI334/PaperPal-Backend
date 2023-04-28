import { body, } from "express-validator";
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
    static validator = () =>{
        return [
            ...RegisterDTO.validator(),
            body("password", "Password field does not exist").exists(),
            body("password", "Password field must contain at least 6 characters").isLength({ min: 6 }).escape(),
        ];
    }; 
}
