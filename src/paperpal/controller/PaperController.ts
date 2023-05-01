
import { controller, httpGet, httpPost, requestParam } from "inversify-express-utils";
import { Request, Response } from "express";

import { inject } from "inversify";
import { Authenticate } from "@app/middleware/Authenticate";
import ValidateRequest from "@app/middleware/ValidateRequest";
import PaperDTO from "@app/paperpal/types/dto/PaperDTO";
import BaseHttpResponse from "@helper/BaseHttpResponse";
import PaperService from "@service/paper/PaperService";
import { TokenData } from "@app/paperpal/types/TokenData";
import { upload } from "@app/middleware/PaperUpload";

@controller("/paper")
export default class PaperController {
    constructor(
        @inject(PaperService) private readonly paperService: PaperService,
    ) {}

    @httpGet("/", Authenticate.any())
    async getAvailablePapers(req: Request, res: Response) {
        const data = await this.paperService.getAllPapers(res.locals.accountId);
        
        const response = BaseHttpResponse.success(data);
        return response.toExpressResponse(res);
    }

    @httpPost("/upload", 
        Authenticate.for("AUTHOR"), 
        upload.single("paper"),
        ValidateRequest.using(PaperDTO.validator()))
    async addPaper(req: Request, res: Response) {
        console.log(req.body as PaperDTO);
        const data = await this.paperService.addPaper(req.body as PaperDTO, req.file?.path, res.locals as TokenData);
        const response = BaseHttpResponse.success(data);
        return response.toExpressResponse(res);
    }

    @httpGet("/:paperId")
    async getPaperFile(@requestParam("paperId") paperId: number, req: Request, res: Response) {
        const path = await this.paperService.getPaperFileLocation(res.locals.accountId, paperId);

        return res.sendFile(path);
    }

    @httpGet("/author", Authenticate.for("AUTHOR"))
    async getPaperByAuthorId(req: Request, res: Response) {
        const data = this.paperService.getAllPapers(res.locals.accountId);
        
        const response = BaseHttpResponse.success(data);
        return response.toExpressResponse(res);
    }

    @httpPost("/judge/:paperId", 
        Authenticate.for("CHAIR"), 
        ValidateRequest.using(PaperDTO.paperStatusValidator()))
    async judgePaper(@requestParam("paperId") paperId: number, req: Request, res: Response) {
        const data = this.paperService.judgePaper(paperId, res.locals.conferenceId, req.body.paperStatus);

        const response = BaseHttpResponse.success(data);
        return response.toExpressResponse(res);
    }
}