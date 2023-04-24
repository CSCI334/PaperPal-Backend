import { Request, Response } from "express";
import { inject } from "inversify";
import { controller, httpGet, httpPost } from "inversify-express-utils";
import "./helper/TokenType.js";

import { STATUS_CODE } from "../../constants/HttpConstants.js";
import ValidateRequest from "../../middleware/ValidateRequest.js";
import LoginDTO from "../dto/LoginDTO.js";
import SignUpDTO from "../dto/AuthorRegisterDTO.js";
import AccountService from "../service/account/AccountService.js";
import { Authenticate } from "../../middleware/Authenticate.js";
import BaseHttpResponse from "../../helper/BaseHttpResponse.js";
import InviteDTO from "../dto/InviteDTO.js";
import VerifyEmailDTO from "../dto/VerifyEmailDTO.js";


@controller("")
export default class AccountController {
    constructor(@inject(AccountService) private readonly accountService: AccountService) {}

    @httpPost("/register", ValidateRequest.using(SignUpDTO.validator))
    async signUp(req: Request, res: Response) {
        const userData = await this.accountService.register(req.body as SignUpDTO);
        const response = BaseHttpResponse.success(userData);
        return response.toExpressResponse(res);
    }

    @httpPost("/invite", Authenticate.for("ADMIN"), ValidateRequest.using(InviteDTO.validator))
    async invite(req: Request, res: Response) {
        const userData = await this.accountService.register(req.body as InviteDTO);
        const response = BaseHttpResponse.success(userData);
        return response.toExpressResponse(res);
    }

    @httpPost("/login", ValidateRequest.using(LoginDTO.validator))
    async login(req: Request, res: Response) {
        const userData = await this.accountService.login(req.body as LoginDTO);
        const response = BaseHttpResponse.success(userData);
        return response.toExpressResponse(res);
    }

    @httpPost("/verify", ValidateRequest.using(VerifyEmailDTO.validator))
    async verify(req: Request, res: Response) {
        const data = await this.accountService.verifyEmail(req.body as VerifyEmailDTO);
        const response = BaseHttpResponse.success(data);
        return response.toExpressResponse(res);
    }

    @httpGet("/user", Authenticate.any())
    async getUserData(req: Request, res: Response) {
        const response = await this.accountService.getUserData(res.locals.uid);
        return res.status(STATUS_CODE.OK).json({
            token: res.locals.token,
            username: response.username,
            email: response.email,
        });
    }
}
