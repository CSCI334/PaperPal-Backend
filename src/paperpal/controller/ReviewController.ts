import { controller, httpGet, httpPost, requestParam } from "inversify-express-utils";
import { Request , Response } from "express";

import { inject } from "inversify";
import { Authenticate } from "@app/middleware/Authenticate";
import ValidateRequest from "@app/middleware/ValidateRequest";
import CommentDTO from "@app/paperpal/types/dto/CommentDTO";
import PaperRatingDTO from "@app/paperpal/types/dto/PaperRatingDTO";
import ReviewRatingDTO from "@app/paperpal/types/dto/ReviewRatingDTO";
import BaseHttpResponse from "@helper/BaseHttpResponse";
import ReviewService from "@service/review/ReviewService";

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

    @httpGet("/testing")
    async doesReview(req: Request, res: Response) {
        await this.reviewService.test();
        return;
    }
}