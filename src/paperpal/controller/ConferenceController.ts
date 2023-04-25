
import { controller, httpGet, httpPost, httpPut } from "inversify-express-utils";
import { Request ,Response } from "express";
import BaseHttpResponse from "../../helper/BaseHttpResponse.js";
import { Authenticate } from "../../middleware/Authenticate.js";
import AccountService from "../service/account/AccountService.js";
import { inject } from "inversify";
import ConferenceService from "../service/conference/ConferenceService.js";
import CreateConferenceDTO from "../dto/CreateConferenceDTO.js";
import UpdateConferenceDTO from "../dto/UpdateConferenceDTO.js";

@controller("/admin", Authenticate.for("ADMIN"))
export default class ConferenceController{
    constructor(
        @inject(AccountService) private readonly accountService: AccountService,
        @inject(ConferenceService) private readonly conferenceService : ConferenceService) {}

    @httpPost("/conference")
    async createConference(req: Request, res: Response) {
        const data = await this.conferenceService.createConference(req.body as CreateConferenceDTO);

        const response = BaseHttpResponse.success(data);
        return response.toExpressResponse(res);
    }

    @httpPut("/conference")
    async updateConference(req: Request, res: Response) {
        const data = this.conferenceService.updateConference(req.body as UpdateConferenceDTO);

        const response = BaseHttpResponse.success(data);
        return response.toExpressResponse(res);
    }
}