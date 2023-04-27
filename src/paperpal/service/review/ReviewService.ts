import { inject, injectable } from "inversify";
import AuthorReviewStrategy from "./impl/AuthorReviewStrategy.js";
import ReviewerReviewStrategy from "./impl/ReviewerReviewStrategy.js";
import { AccountType } from "../../../database/models/Account.js";
import ChairReviewStrategy from "./impl/ChairReviewStrategy.js";
import ReviewRepository from "../../repository/ReviewRepository.js";
import CommentDTO from "../../types/dto/CommentDTO.js";
import PaperRatingDTO from "../../types/dto/PaperRatingDTO.js";
import ReviewRatingDTO from "../../types/dto/ReviewRatingDTO.js";

@injectable()
export default class ReviewService {
    constructor(
        @inject(AuthorReviewStrategy) private readonly authorReviewStrategy : AuthorReviewStrategy,
        @inject(ReviewerReviewStrategy) private readonly reviewerReviewStrategy : ReviewerReviewStrategy,
        @inject(ChairReviewStrategy) private readonly chairReviewStrategy : ChairReviewStrategy,
        @inject(ReviewRepository) private readonly reviewRepository : ReviewRepository) {}

    private getStrategy(accountType : AccountType) {
        if(accountType === "ADMIN")
            return this.authorReviewStrategy;
        else if(accountType === "AUTHOR")
            return this.reviewerReviewStrategy;
        else if(accountType === "CHAIR")
            return this.chairReviewStrategy;
    }
        
    async getComments(accountType : AccountType, paperId : number) {
        const strategy = this.getStrategy(accountType);
        return strategy.getComments(paperId);
    }

    async getReviews(accountType : AccountType, paperId : number) {
        const strategy = this.getStrategy(accountType);
        return strategy.getReviews(paperId);
    }
    
    async addComments(reviewerId : number, commentDTO : CommentDTO) {
        const data = this.reviewRepository.addComment(reviewerId, commentDTO.paperId, commentDTO.comment);
        return data;
    }

    async addPaperRating(reviewerId : number, ratingDTO : PaperRatingDTO)  {
        const data = await this.reviewRepository.setPaperRating(reviewerId, ratingDTO.paperId, ratingDTO.rating);
        return data;
    }

    async addRatingOfReview(reviewerId : number, ratingDTO : ReviewRatingDTO){
        const data = await this.reviewRepository.setReviewRating(reviewerId, ratingDTO.reviewId, ratingDTO.rating);
        return data;
    }
}