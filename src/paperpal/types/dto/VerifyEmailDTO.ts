import { body, } from "express-validator";

export default class VerifyEmailDTO {

    constructor(
        public readonly password: string,
    ) {}
    static validator = () => {
        return [
            body("password", "Password field does not exist").exists(),
            body("password","Password field must contain at least 6 characters").isLength({ min: 6 }).escape(),
        ];
    }; 
}
