import { controller, httpPost } from "inversify-express-utils";
import { inject } from "inversify";
import BaseHttpResponse from "../../helper/BaseHttpResponse.js";
import { Request, Response } from "express";
import BidService from "../service/bid/BidService.js";
import { Authenticate } from "../../middleware/Authenticate.js";
import Phase from "../../middleware/Phase.js";
import { ConferencePhase } from "../types/ConferencePhase.js";
import BidDTO from "../types/dto/BidDTO.js";
import ValidateRequest from "../../middleware/ValidateRequest.js";
import WorkloadDTO from "../types/dto/WorkloadDTO.js";

@controller("")
export default class BidController {
    constructor(@inject(BidService) private readonly bidService: BidService) {}

    @httpPost("/bid", Authenticate.for("REVIEWER"), Phase.isAnyOf(ConferencePhase.Bidding))
    async addBid(req: Request, res: Response) {
        await this.bidService.addBid(res.locals.accountId, req.body as BidDTO);

        const response = BaseHttpResponse.success({});
        return response.toExpressResponse(res);
    }

    @httpPost("/workload", 
        Authenticate.for("REVIEWER"), 
        Phase.isAnyOf(ConferencePhase.Bidding, ConferencePhase.Submission), 
        ValidateRequest.using(WorkloadDTO.validator()))
    async setReviewerWorkload(req: Request, res: Response) {
        await this.bidService.setWorkload(res.locals.accountId, req.body.amountOfPaper);

        const response = BaseHttpResponse.success({});
        return response.toExpressResponse(res);
    }
}