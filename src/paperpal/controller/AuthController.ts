import { Request, Response } from "express";
import { inject } from "inversify";
import { controller, httpGet, httpPost } from "inversify-express-utils";

import { STATUS_CODE } from "../../constants/HttpConstants.js";
import ValidateRequest from "../../middleware/ValidateRequest.js";
import LoginDTO from "../dto/LoginDTO.js";
import SignUpDTO from "../dto/SignUpDTO.js";
import AuthService from "../service/AuthService.js";
import { Authenticate } from "../../middleware/Authenticate.js";
import BaseHttpResponse from "../../helper/BaseHttpResponse.js";


@controller("/auth")
export default class AuthController {
    constructor(@inject(AuthService) private readonly authService: AuthService) {}

    @httpPost("/register", ValidateRequest.using(SignUpDTO.validator))
    async signUp(req: Request, res: Response) {
        const userData = await this.authService.signUp(req.body as SignUpDTO);
        const response = BaseHttpResponse.success(userData);
        return response.toExpressResponse(res);
    }

    @httpPost("/login", ValidateRequest.using(LoginDTO.validator))
    async login(req: Request, res: Response) {
        const response = await this.authService.login(req.body as LoginDTO);
        return res.status(STATUS_CODE.OK).json(response);
    }

    @httpGet("/user", Authenticate.any())
    async user(req: Request, res: Response) {
        const response = await this.authService.getUserData(res.locals.decodedToken.uid);
        return res.status(STATUS_CODE.OK).json({
            token: res.locals.token,
            username: response.username,
            email: response.email,
        });
    }
}
