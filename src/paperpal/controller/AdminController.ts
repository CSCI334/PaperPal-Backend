
import { controller, httpGet, httpPost, httpPut } from "inversify-express-utils";
import { Response } from "express";
import BaseHttpResponse from "../../helper/BaseHttpResponse.js";

@controller("/admin")
export default class ConferenceController{
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

    @httpPost("/reviewer")
    async createNewReviewer(req: Request, res: Response) {
        const response = BaseHttpResponse.success({});
        return response.toExpressResponse(res);
    }

    @httpPost("/email/reviewer")
    async sendEmailToReviewer(req: Request, res: Response) {
        const response = BaseHttpResponse.success({});
        return response.toExpressResponse(res);
    }
}