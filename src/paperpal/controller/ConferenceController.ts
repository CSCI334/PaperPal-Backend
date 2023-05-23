
import { controller, httpGet, httpPost, httpPut } from "inversify-express-utils";
import { Request ,Response } from "express";

import { inject } from "inversify";
import { Authenticate } from "@app/middleware/Authenticate";
import ValidateRequest from "@app/middleware/ValidateRequest";
import CreateConferenceDTO from "@app/paperpal/types/dto/CreateConferenceDTO";
import UpdateConferenceDTO from "@app/paperpal/types/dto/UpdateConferenceDTO";
import BaseHttpResponse from "@helper/BaseHttpResponse";
import ConferenceService from "@service/conference/ConferenceService";
import BidService from "@service/bid/BidService";

@controller("")
export default class ConferenceController{
    constructor(
        @inject(ConferenceService) private readonly conferenceService : ConferenceService,
        @inject(BidService) private readonly bidService : BidService
    ) {}

    @httpGet("/conference")
    async getConferenceInfo(req: Request, res: Response) {
        const data = await this.conferenceService.getConferenceInfo();
        
        const response = BaseHttpResponse.success(data);
        return response.toExpressResponse(res);
    }

    @httpPost("/admin/conference", 
        Authenticate.for("ADMIN"),    
        ValidateRequest.using(CreateConferenceDTO.validator())
    )
    async createConference(req: Request, res: Response) {
        const data = await this.conferenceService.createConference(req.body as CreateConferenceDTO);
        
        const response = BaseHttpResponse.success(data);
        return response.toExpressResponse(res);
    }

    @httpPut("/admin/conference", 
        Authenticate.for("ADMIN"),
        ValidateRequest.using(UpdateConferenceDTO.validator())
    )
    async updateConference(req: Request, res: Response) {
        await this.conferenceService.updateConference(req.body as UpdateConferenceDTO);
        
        const response = BaseHttpResponse.success({});
        return response.toExpressResponse(res);
    }

    @httpGet("/next-phase",)
    async moveToNextPhase(req: Request, res: Response) {
        const response = BaseHttpResponse.success(await this.conferenceService.moveToNextPhase());
        return response.toExpressResponse(res);
    }

    @httpGet("/prev-phase")
    async moveToPrevPhase(req: Request, res: Response) {
        const response = BaseHttpResponse.success(await this.conferenceService.moveToPrevPhase());
        return response.toExpressResponse(res);
    }

    @httpGet("/allocate-papers")
    async allocatePapers(req: Request, res: Response) {
        await this.bidService.allocateAllPapers();

        const response = BaseHttpResponse.success({});
        return response.toExpressResponse(res);
    }
    
    @httpGet("/send-announcement")
    async sendAnnouncement(req: Request, res: Response) {
        await this.conferenceService.sendAnnouncementEmails();

        const response = BaseHttpResponse.success({});
        return response.toExpressResponse(res);
    }
}