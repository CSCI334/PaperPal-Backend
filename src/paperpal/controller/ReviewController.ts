import { controller, httpGet, httpPost, requestParam } from "inversify-express-utils";
import { STATUS_CODE } from "../../constants/HttpConstants.js";
import { Response, response } from "express";
import { Authenticate } from "../../middleware/Authenticate.js";
import { inject } from "inversify";
import ReviewService from "../service/review/ReviewService.js";

@controller("/paper")
export default class ReviewController{
    constructor(@inject(ReviewService) private readonly reviewService: ReviewService) {}

    @httpGet("/:paperId/comments", Authenticate.any()) 
    async getPaperComments(@requestParam("paperId") paperId: number, req: Request, res: Response) {
        const response = this.reviewService.getComments(res.locals.accounttype, paperId);
        return res.status(STATUS_CODE.OK).json(response);
    }

    @httpPost("/:paperId/comments", Authenticate.for("REVIEWER"))
    async addComments(@requestParam("paperId") paperId: number, req: Request, res: Response) {
        const response = this.reviewService.addReviewForPaper(0, paperId, res.locals.uid);
        return res.status(STATUS_CODE.OK).json(response);
    }

    @httpGet("/:paperId/review", Authenticate.any()) 
    async getPaperReview(@requestParam("paperId") paperId: number, req: Request, res: Response) {
        const response = this.reviewService.getReviews(res.locals.accounttype, paperId);
        return res.status(STATUS_CODE.OK).json(response);
    }

    @httpPost("/:paperId/review", Authenticate.for("REVIEWER"))
    async addReview(@requestParam("paperId") paperId: number, req: Request, res: Response) {
        const response = this.reviewService.addReviewForPaper(0, paperId, res.locals.uid);
        return res.status(STATUS_CODE.OK).json(response);
    }

    @httpPost("/:paperId/review", Authenticate.for("AUTHOR"))
    async addReviewOfReview(@requestParam("paperId") paperId: number, req: Request, res: Response) {
        return res.status(STATUS_CODE.OK).json(response);
    }
}