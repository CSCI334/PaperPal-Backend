
import { controller, httpPost, httpPut } from "inversify-express-utils";
import { Request ,Response } from "express";
import BaseHttpResponse from "../../helper/BaseHttpResponse.js";
import { Authenticate } from "../../middleware/Authenticate.js";
import AccountService from "../service/account/AccountService.js";
import { inject } from "inversify";
import ConferenceService from "../service/conference/ConferenceService.js";
import CreateConferenceDTO from "../types/dto/CreateConferenceDTO.js";
import UpdateConferenceDTO from "../types/dto/UpdateConferenceDTO.js";
import ValidateRequest from "../../middleware/ValidateRequest.js";

@controller("/admin", Authenticate.for("ADMIN"))
export default class ConferenceController{
    constructor(
        @inject(AccountService) private readonly accountService: AccountService,
        @inject(ConferenceService) private readonly conferenceService : ConferenceService) {}

    @httpPost("/conference", ValidateRequest.using(CreateConferenceDTO.validator()))
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