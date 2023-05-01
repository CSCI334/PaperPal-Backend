
import { controller, httpPost, httpPut } from "inversify-express-utils";
import { Request ,Response } from "express";

import { inject } from "inversify";
import { Authenticate } from "@app/middleware/Authenticate";
import ValidateRequest from "@app/middleware/ValidateRequest";
import CreateConferenceDTO from "@app/paperpal/types/dto/CreateConferenceDTO";
import UpdateConferenceDTO from "@app/paperpal/types/dto/UpdateConferenceDTO";
import BaseHttpResponse from "@helper/BaseHttpResponse";
import ConferenceService from "@service/conference/ConferenceService";

@controller("/admin", Authenticate.for("ADMIN"))
export default class ConferenceController{
    constructor(
        @inject(ConferenceService) private readonly conferenceService : ConferenceService) {}

    @httpPost("/conference", ValidateRequest.using(CreateConferenceDTO.validator()))
    async createConference(req: Request, res: Response) {
        const data = await this.conferenceService.createConference(req.body as CreateConferenceDTO);
        
        const response = BaseHttpResponse.success(data);
        return response.toExpressResponse(res);
    }

    @httpPut("/conference", ValidateRequest.using(UpdateConferenceDTO.validator()))
    async updateConference(req: Request, res: Response) {
        await this.conferenceService.updateConference(req.body as UpdateConferenceDTO);
        const response = BaseHttpResponse.success({});
        return response.toExpressResponse(res);
    }
}