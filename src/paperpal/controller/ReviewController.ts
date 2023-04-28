import { controller, httpGet, httpPost, requestParam } from "inversify-express-utils";
import { Request ,Response } from "express";

import { Authenticate } from "../../middleware/Authenticate.js";
import { inject } from "inversify";
import ReviewService from "../service/review/ReviewService.js";
import ValidateRequest from "../../middleware/ValidateRequest.js";
import CommentDTO from "../types/dto/CommentDTO.js";
import PaperRatingDTO from "../types/dto/PaperRatingDTO.js";
import ReviewRatingDTO from "../types/dto/ReviewRatingDTO.js";
import BaseHttpResponse from "../../helper/BaseHttpResponse.js";

@controller("/paper")
export default class ReviewController{
    constructor(@inject(ReviewService) private readonly reviewService: ReviewService) {}

    @httpGet("/:paperId/comments", Authenticate.any()) 
    async getPaperComments(@requestParam("paperId") paperId: number, req: Request, res: Response) {
        const data = await this.reviewService.getComments(res.locals.accountId, paperId);
        
        const response = BaseHttpResponse.success(data);
        return response.toExpressResponse(res);
    }

    @httpGet("/:paperId/review", Authenticate.any()) 
    async getPaperReview(@requestParam("paperId") paperId: number, req: Request, res: Response) {
        const data = await this.reviewService.getReviews(res.locals.accountId, paperId);
        
        const response = BaseHttpResponse.success(data);
        return response.toExpressResponse(res);
    }
    
    @httpPost("/comments", Authenticate.for("REVIEWER"))
    async addComments(req: Request, res: Response) {
        const data = await this.reviewService.addComments(res.locals.accountId, req.body as CommentDTO);
        
        const response = BaseHttpResponse.success(data);
        return response.toExpressResponse(res);
    }
    
    @httpPost("/review", Authenticate.for("REVIEWER"), ValidateRequest.using(PaperRatingDTO.validator()))
    async addReview(req: Request, res: Response) {
        await this.reviewService.addPaperRating(res.locals.accountId, req.body as PaperRatingDTO);
        
        const response = BaseHttpResponse.success({});
        return response.toExpressResponse(res);
    }

    @httpPost("/review/rating", Authenticate.for("AUTHOR"), ValidateRequest.using(ReviewRatingDTO.validator()))
    async addRatingOfReview(req: Request, res: Response) {
        await this.reviewService.addRatingOfReview(res.locals.accountId, req.body as ReviewRatingDTO);
        
        const response = BaseHttpResponse.success({});
        return response.toExpressResponse(res);
    }
}