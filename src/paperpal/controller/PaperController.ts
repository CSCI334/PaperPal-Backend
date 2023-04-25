
import { controller, httpGet, httpPost, requestParam } from "inversify-express-utils";
import { Response } from "express";
import { Authenticate } from "../../middleware/Authenticate.js";
import { inject } from "inversify";
import PaperService from "../service/paper/PaperService.js";
import BaseHttpResponse from "../../helper/BaseHttpResponse.js";

@controller("/paper")
export default class PaperController {
    constructor(@inject(PaperService) private readonly paperService: PaperService) {}

    @httpGet("/", Authenticate.any())
    async getAvailablePapers(req: Request, res: Response) {
        const data = this.paperService.getAllPapers(res.locals.accountType, res.locals.uid);
        
        const response = BaseHttpResponse.success(data);
        return response.toExpressResponse(res);
    }

    @httpPost("/upload", Authenticate.for("AUTHOR"))
    async addPaper(req: Request, res: Response) {
        const data = this.paperService.addPaper(null);
        
        const response = BaseHttpResponse.success(data);
        return response.toExpressResponse(res);
    }

    @httpGet("/:paperId")
    async getPaperById(@requestParam("paperId") paperId: number,req: Request, res: Response) {
        const data = this.paperService.getPaper(res.locals.accountType, paperId);
        const response = BaseHttpResponse.success(data);

        return response.toExpressResponse(res);
    }

    @httpGet("/author", Authenticate.for("AUTHOR"))
    async getPaperByAuthorId(@requestParam("authorId") authorId : number, req: Request, res: Response) {
        const data = this.paperService.getAllPapers(res.locals.accountType, res.locals.uid);
        
        const response = BaseHttpResponse.success(data);
        return response.toExpressResponse(res);
    }

    @httpPost("/judge/:paperId")
    async judgePaper(@requestParam("paperId") paperId: number, req: Request, res: Response) {
        const data = this.paperService.getAllPapers(res.locals.accountType, res.locals.uid);

        const response = BaseHttpResponse.success(data);
        return response.toExpressResponse(res);
    }
}