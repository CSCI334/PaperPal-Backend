
import { controller, httpGet, httpPost, requestParam } from "inversify-express-utils";
import { Request, Response } from "express";

import { inject } from "inversify";
import { Authenticate } from "@app/middleware/Authenticate";
import Phase from "@app/middleware/Phase";
import { upload } from "@app/middleware/Upload";
import ValidateRequest from "@app/middleware/ValidateRequest";
import { ConferencePhase } from "@app/paperpal/types/ConferencePhase";
import PaperDTO from "@app/paperpal/types/dto/PaperDTO";
import BaseHttpResponse from "@helper/BaseHttpResponse";
import PaperService from "@service/paper/PaperService";




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
        const data = this.paperService.addPaper(req.body as PaperDTO, "req.file.path", res.locals.accountId);
        
        const response = BaseHttpResponse.success(data);
        return response.toExpressResponse(res);
    }

    @httpGet("/:paperId")
    async getPaperFile(@requestParam("paperId") paperId: number, req: Request, res: Response) {
        const path = await this.paperService.getPaperFileLocation(res.locals.accountId, paperId);

        return res.sendFile(path);
    }

    @httpGet("/author", Authenticate.for("AUTHOR"))
    async getPaperByAuthorId(@requestParam("authorId") authorId : number, req: Request, res: Response) {
        const data = this.paperService.getAllPapers(res.locals.accountId);
        
        const response = BaseHttpResponse.success(data);
        return response.toExpressResponse(res);
    }

    @httpPost("/judge/:paperId", 
        Authenticate.for("CHAIR"), 
        Phase.isCurrently(ConferencePhase.Judgment), 
        ValidateRequest.using(PaperDTO.paperStatusValidator()))
    async judgePaper(@requestParam("paperId") paperId: number, req: Request, res: Response) {
        const data = this.paperService.judgePaper(paperId , req.body.paperStatus);

        const response = BaseHttpResponse.success(data);
        return response.toExpressResponse(res);
    }
}