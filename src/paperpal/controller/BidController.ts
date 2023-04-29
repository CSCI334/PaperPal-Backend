import { controller, httpPost } from "inversify-express-utils";
import { Request ,Response } from "express";
import { inject } from "inversify";
import { Authenticate } from "@app/middleware/Authenticate";
import Phase from "@app/middleware/Phase";
import ValidateRequest from "@app/middleware/ValidateRequest";
import { ConferencePhase } from "@app/paperpal/types/ConferencePhase";
import BidDTO from "@app/paperpal/types/dto/BidDTO";
import WorkloadDTO from "@app/paperpal/types/dto/WorkloadDTO";
import BaseHttpResponse from "@helper/BaseHttpResponse";
import BidService from "@service/bid/BidService";


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