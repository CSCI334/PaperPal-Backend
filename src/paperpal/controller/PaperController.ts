
import { controller, httpGet, httpPost } from "inversify-express-utils";
import { STATUS_CODE } from "../../constants/HttpConstants.js";
import { Response } from "express";
import { Authenticate } from "../../middleware/Authenticate.js";

@controller("/paper")
export default class PaperController {

    @httpGet("/")
    async getAllPapers(req: Request, res: Response) {
        return res.status(STATUS_CODE.OK).json();
    }

    @httpGet("/:id")
    async getPaperById(req: Request, res: Response) {
        return res.status(STATUS_CODE.OK).json();
    }

    @httpGet("/author", Authenticate.for("AUTHOR"))
    async getPaperByAuthorId(req: Request, res: Response) {
        return res.status(STATUS_CODE.OK).json();
    }

    @httpPost("/paper/judge")
    async judgePaper(req: Request, res: Response) {
        return res.status(STATUS_CODE.OK).json();
    }    
}