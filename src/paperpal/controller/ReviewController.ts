import { controller, httpGet, httpPost, requestParam } from "inversify-express-utils";
import { STATUS_CODE } from "../../constants/HttpConstants.js";
import { Response } from "express";
import { Authenticate } from "../../middleware/Authenticate.js";
import { inject } from "inversify";
import ReviewService from "../service/review/ReviewService.js";

@controller("/review")
export default class ReviewController{
    constructor(@inject(ReviewService) private readonly reviewService: ReviewService) {}

    @httpGet("/:paperId/comments", Authenticate.use()) 
    async getPaperComments(@requestParam("paperId") paperId: number, req: Request, res: Response) {
        const response = this.reviewService.getComments(res.locals.accountType, paperId);
        return res.status(STATUS_CODE.OK).json(response);
    }

    @httpGet("/:paperId", Authenticate.use()) 
    async getPaperReview(@requestParam("paperId") paperId: number, req: Request, res: Response) {
        const response = this.reviewService.getReviews(res.locals.accountType, paperId);
        return res.status(STATUS_CODE.OK).json(response);
    }

    @httpPost("/:paperId", Authenticate.for("REVIEWER"))
    async addReview(@requestParam("paperId") paperId: number, req: Request, res: Response) {
        const response = this.reviewService.addReviewForPaper(0, paperId, res.locals.uid);
        return res.status(STATUS_CODE.OK).json(response);
    }
}