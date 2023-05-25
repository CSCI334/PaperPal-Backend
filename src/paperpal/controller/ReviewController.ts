import { controller, httpGet, httpPost, requestParam } from "inversify-express-utils";
import { Request , Response } from "express";

import { inject } from "inversify";
import { Authenticate } from "@app/middleware/Authenticate";
import ValidateRequest from "@app/middleware/ValidateRequest";
import CommentDTO from "@app/paperpal/types/dto/CommentDTO";
import ReviewDTO from "@app/paperpal/types/dto/PaperRatingDTO";
import ReviewRatingDTO from "@app/paperpal/types/dto/ReviewRatingDTO";
import BaseHttpResponse from "@helper/BaseHttpResponse";
import ReviewService from "@service/review/ReviewService";

@controller("/paper")
export default class ReviewController{
    constructor(
        @inject(ReviewService) private readonly reviewService: ReviewService
    ) {}

    @httpGet("/:paperId/comments", Authenticate.any()) 
    async getPaperComments(@requestParam("paperId") paperId: number, req: Request, res: Response) {
        const data = await this.reviewService.getComments(res.locals.accountId, paperId);
        
        const response = BaseHttpResponse.success(data);
        return response.toExpressResponse(res);
    }

    @httpGet("/:paperId/reviews", Authenticate.any()) 
    async getPaperReviews(@requestParam("paperId") paperId: number, req: Request, res: Response) {
        const data = await this.reviewService.getReviews(res.locals.accountId, paperId);
        
        const response = BaseHttpResponse.success(data);
        return response.toExpressResponse(res);
    }
    
    @httpPost("/comments", Authenticate.for("REVIEWER"), ValidateRequest.using(CommentDTO.validator()))
    async addComments(req: Request, res: Response) {
        const data = await this.reviewService.addComments(res.locals.accountId, req.body as CommentDTO);
        
        const response = BaseHttpResponse.success(data);
        return response.toExpressResponse(res);
    }
    
    @httpPost("/review", Authenticate.for("REVIEWER"), ValidateRequest.using(ReviewDTO.validator()))
    async addReview(req: Request, res: Response) {
        const data = await this.reviewService.addReview(res.locals.accountId, req.body as ReviewDTO);
        
        const response = BaseHttpResponse.success(data);
        return response.toExpressResponse(res);
    }

    @httpPost("/review/rating", Authenticate.for("AUTHOR"), ValidateRequest.using(ReviewRatingDTO.validator()))
    async addRatingOfReview(req: Request, res: Response) {
        const data = await this.reviewService.addRatingOfReview(req.body as ReviewRatingDTO);
        
        const response = BaseHttpResponse.success(data);
        return response.toExpressResponse(res);
    }
}