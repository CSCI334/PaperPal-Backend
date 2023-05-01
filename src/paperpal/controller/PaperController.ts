
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
import { ROOT_DIR } from "@app/constants/AppConstants";
import path from "path";
import fs from "fs";
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

    @httpGet("/:paperId", Authenticate.any())
    async getPaperFile(@requestParam("paperId") paperId: number, req: Request, res: Response) {
        const fileLocation = await this.paperService.getPaperFileLocation(res.locals.accountId, paperId);
        const file = fs.readFileSync(path.resolve(ROOT_DIR, fileLocation) );
        
        res.type("pdf");
        res.status(200).send(file);
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