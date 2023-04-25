import { check } from "express-validator";

export default class LoginDTO {
    constructor(public readonly email: string, public readonly password: string) {}
    static validator = [
        check("email", "Email field does not exist").exists(),
        check("password", "Password field does not exist").exists(),
    ];
}
