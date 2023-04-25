import { Request, Response } from "express";
import { inject } from "inversify";
import { controller, httpGet, httpPost } from "inversify-express-utils";

import { STATUS_CODE } from "../../constants/HttpConstants.js";
import ValidateRequest from "../../middleware/ValidateRequest.js";
import LoginDTO from "../types/dto/LoginDTO.js";
import SignUpDTO from "../types/dto/AuthorRegisterDTO.js";
import AccountService from "../service/account/AccountService.js";
import { Authenticate } from "../../middleware/Authenticate.js";
import BaseHttpResponse from "../../helper/BaseHttpResponse.js";
import InviteDTO from "../types/dto/InviteDTO.js";
import VerifyEmailDTO from "../types/dto/VerifyEmailDTO.js";


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

    @httpGet("/contact", Authenticate.for("ADMIN"))
    async getAllReviewer(req: Request, res: Response) {
        const data = this.accountService.getAllReviewer();

        const response = BaseHttpResponse.success(data);
        return response.toExpressResponse(res);
    }

    @httpPost("/contact/email", Authenticate.for("ADMIN"))
    async sendEmailToReviewer(req: Request, res: Response) {
        const response = BaseHttpResponse.success({});
        return response.toExpressResponse(res);
    }
}
