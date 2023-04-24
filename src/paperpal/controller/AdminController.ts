
import { controller, httpGet, httpPost, httpPut } from "inversify-express-utils";
import { Response } from "express";
import BaseHttpResponse from "../../helper/BaseHttpResponse.js";
import { Authenticate } from "../../middleware/Authenticate.js";
import AuthService from "../service/account/AccountService.js";
import { inject } from "inversify";

@controller("/admin", Authenticate.for("ADMIN"))
export default class ConferenceController{
    constructor(@inject(AuthService) private readonly authService: AuthService) {}

    @httpPost("/conference")
    async createConference(req: Request, res: Response) {
        const response = BaseHttpResponse.success({});
        return response.toExpressResponse(res);
    }

    @httpPut("/conference")
    async updateConference(req: Request, res: Response) {
        const response = BaseHttpResponse.success({});
        return response.toExpressResponse(res);
    }

    @httpGet("/reviewer")
    async getAllReviewer(req: Request, res: Response) {
        const response = BaseHttpResponse.success({});
        return response.toExpressResponse(res);
    }

    @httpPost("/email/reviewer")
    async sendEmailToReviewer(req: Request, res: Response) {
        const response = BaseHttpResponse.success({});
        return response.toExpressResponse(res);
    }
}