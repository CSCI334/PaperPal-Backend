import { body, } from "express-validator";
import RegisterDTO from "@app/paperpal/types/dto/RegisterDTO";
import { AccountType } from "@model/Account";

export default class SignUpDTO extends RegisterDTO {
    constructor(
        public readonly email: string, 
        public readonly username: string, 
        public readonly password: string,
        public readonly accountType: AccountType) {
        super(email, username, password, "AUTHOR");
    }
    static validator = () =>{
        return [
            ...RegisterDTO.validator(),
            body("password", "Password field does not exist").exists(),
            body("password", "Password field must contain at least 6 characters").isLength({ min: 6 }).escape(),
            body("accountType", "accountType field does not exist").exists(),
            body("accountType", "accountType field is invalid. Value can only be CHAIR, REVIEWER, or AUTHOR").isIn([
                "AUTHOR"
            ]),
        ];
    };
}
