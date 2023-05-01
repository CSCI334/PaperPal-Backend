import { STATUS_CODE } from "@app/constants/HttpConstants";
import { Authenticate } from "@app/middleware/Authenticate";
import ValidateRequest from "@app/middleware/ValidateRequest";
import { TokenData } from "@app/paperpal/types/TokenData";
import SignUpDTO from "@app/paperpal/types/dto/AuthorRegisterDTO";
import InviteDTO from "@app/paperpal/types/dto/InviteDTO";
import LoginDTO from "@app/paperpal/types/dto/LoginDTO";
import VerifyEmailDTO from "@app/paperpal/types/dto/VerifyEmailDTO";
import BaseHttpResponse from "@helper/BaseHttpResponse";
import AccountService from "@service/account/AccountService";
import { Request, Response } from "express";
import { inject } from "inversify";
import { controller, httpGet, httpPost } from "inversify-express-utils";

@controller("")
export default class AccountController {
    constructor(
        @inject(AccountService) private readonly accountService: AccountService
    ) {}

    @httpPost("/register", ValidateRequest.using(SignUpDTO.validator()))
    async signUp(req: Request, res: Response) {
        const userData = await this.accountService.register(req.body as SignUpDTO);

        const response = BaseHttpResponse.success(userData);
        return response.toExpressResponse(res);
    }

    @httpPost("/invite", Authenticate.for("ADMIN"), ValidateRequest.using(InviteDTO.validator()))
    async invite(req: Request, res: Response) {
        const userData = await this.accountService.register(req.body as InviteDTO);

        const response = BaseHttpResponse.success(userData);
        return response.toExpressResponse(res);
    }

    @httpPost("/login", ValidateRequest.using(LoginDTO.validator()))
    async login(req: Request, res: Response) {
        const userData = await this.accountService.login(req.body as LoginDTO);

        const response = BaseHttpResponse.success(userData);
        return response.toExpressResponse(res);
    }

    @httpPost("/verify", ValidateRequest.using(VerifyEmailDTO.validator()), Authenticate.allowPending())
    async verify(req: Request, res: Response) {
        const data = await this.accountService.verifyEmail(req.body as VerifyEmailDTO, res.locals as TokenData);

        const response = BaseHttpResponse.success(data);
        return response.toExpressResponse(res);
    }

    @httpGet("/user", Authenticate.any())
    async getUserData(req: Request, res: Response) {
        const response = await this.accountService.getUser(res.locals.accountId);
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
