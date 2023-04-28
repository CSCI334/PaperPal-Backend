
import { controller, httpGet, httpPost, requestParam } from "inversify-express-utils";
import { Request, Response } from "express";
import { Authenticate } from "../../middleware/Authenticate.js";
import { inject } from "inversify";
import PaperService from "../service/paper/PaperService.js";
import BaseHttpResponse from "../../helper/BaseHttpResponse.js";
import Phase from "../../middleware/Phase.js";
import { ConferencePhase } from "../types/ConferencePhase.js";
import { upload } from "../../middleware/Upload.js";
import PaperDTO from "../types/dto/PaperDTO.js";

@controller("/paper")
export default class PaperController {
    constructor(@inject(PaperService) private readonly paperService: PaperService) {}

    @httpGet("/", Authenticate.any())
    async getAvailablePapers(req: Request, res: Response) {
        const data = this.paperService.getAllPapers(res.locals.accountId);
        
        const response = BaseHttpResponse.success(data);
        return response.toExpressResponse(res);
    }

    @httpPost("/upload", Authenticate.for("AUTHOR"), Phase.isCurrently(ConferencePhase.Submission), upload.single("paper"))
    async addPaper(req: Request, res: Response) {
        const data = this.paperService.addPaper(req.body as PaperDTO, res.locals.accountId);
        
        console.log(req.file.filename);
        const response = BaseHttpResponse.success(data);
        return response.toExpressResponse(res);
    }

    @httpGet("/:paperId")
    async getPaperById(@requestParam("paperId") paperId: number, req: Request, res: Response) {
        const data = this.paperService.getPaper(res.locals.accountId, paperId);
        const response = BaseHttpResponse.success(data);

        return response.toExpressResponse(res);
    }

    @httpGet("/author", Authenticate.for("AUTHOR"))
    async getPaperByAuthorId(@requestParam("authorId") authorId : number, req: Request, res: Response) {
        const data = this.paperService.getAllPapers(res.locals.accountId);
        
        const response = BaseHttpResponse.success(data);
        return response.toExpressResponse(res);
    }

    @httpPost("/judge/:paperId", Authenticate.for("CHAIR"), Phase.isCurrently(ConferencePhase.Judgment))
    async judgePaper(@requestParam("paperId") paperId: number, req: Request, res: Response) {
        const data = this.paperService.judgePaper(paperId ,"ACCEPTED");

        const response = BaseHttpResponse.success(data);
        return response.toExpressResponse(res);
    }
}