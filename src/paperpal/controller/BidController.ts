import { controller, httpGet, httpPost } from "inversify-express-utils";
import { inject } from "inversify";
import BaseHttpResponse from "../../helper/BaseHttpResponse.js";
import { Request, Response } from "express";
import BidService from "../service/bid/BidService.js";

@controller("")
export default class BidController {
    constructor(@inject(BidService) private readonly bidService: BidService) {}

    @httpPost("/bid")
    async addBid(req: Request, res: Response) {
        const userData = await this.bidService.addBid();

        const response = BaseHttpResponse.success({});
        return response.toExpressResponse(res);
    }

    @httpPost("/workload")
    async setReviewerWorkload(req: Request, res: Response) {
        const userData = await this.bidService.setWorkload();

        const response = BaseHttpResponse.success({});
        return response.toExpressResponse(res);
    }
}