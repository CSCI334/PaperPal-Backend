import { body, } from "express-validator";
import RegisterDTO from "@app/paperpal/types/dto/RegisterDTO";

export default class SignUpDTO extends RegisterDTO {
    constructor(
        public readonly email: string, 
        public readonly username: string, 
        public readonly password: string, 
        public readonly conferenceId: number) {
        super(email, username, password, "AUTHOR", conferenceId);
    }
    static validator = () =>{
        return [
            ...RegisterDTO.validator(),
            body("password", "Password field does not exist").exists(),
            body("password", "Password field must contain at least 6 characters").isLength({ min: 6 }).escape(),
        ];
    };
}
