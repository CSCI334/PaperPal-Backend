import { controller, httpGet, httpPost } from "inversify-express-utils";
import ValidateRequest from "../../middleware/ValidateRequest.js";
import AccountService from "../service/account/AccountService.js";
import { inject } from "inversify";
import SignUpDTO from "../dto/AuthorRegisterDTO.js";
import BaseHttpResponse from "../../helper/BaseHttpResponse.js";
import { Request, Response } from "express";

@controller("")
export default class BidController {
    constructor(@inject(AccountService) private readonly accountService: AccountService) {}

    @httpPost("/bid")
    async addBid(req: Request, res: Response) {
        const userData = await this.accountService.register(req.body as SignUpDTO);
        const response = BaseHttpResponse.success(userData);
        return response.toExpressResponse(res);
    }

    @httpPost("/workload")
    async setReviewerWorkload(req: Request, res: Response) {
        const userData = await this.accountService.register(req.body as SignUpDTO);
        const response = BaseHttpResponse.success(userData);
        return response.toExpressResponse(res);
    }

    // Return 
    @httpGet("/bid")
    async getAllBids(req: Request, res: Response) {
        return;
    }
}