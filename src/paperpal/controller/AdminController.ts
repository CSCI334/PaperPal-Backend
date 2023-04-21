
import { controller, httpGet, httpPost, httpPut } from "inversify-express-utils";
import { STATUS_CODE } from "../../constants/HttpConstants.js";
import { Response } from "express";


@controller("/admin")
export default class ConferenceController{
    @httpPost("/conference")
    async createConference(req: Request, res: Response) {
        return res.status(STATUS_CODE.OK).json();
    }

    @httpPut("/conference")
    async updateConference(req: Request, res: Response) {
        return res.status(STATUS_CODE.OK).json();
    }

    @httpGet("/reviewer")
    async getAllReviewer(req: Request, res: Response) {
        return res.status(STATUS_CODE.OK).json();
    }

    @httpPost("/reviewer")
    async createNewReviewer(req: Request, res: Response) {
        return res.status(STATUS_CODE.OK).json();
    }

    @httpPost("/email/reviewer")
    async sendEmailToReviewer(req: Request, res: Response) {
        return res.status(STATUS_CODE.OK).json();
    }
}