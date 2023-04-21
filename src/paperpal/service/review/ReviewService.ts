import { inject, injectable } from "inversify";
import AuthorReviewStrategy from "./impl/AuthorReviewStrategy.js";
import ReviewerReviewStrategy from "./impl/ReviewerReviewStrategy.js";
import ReviewInterface from "./ReviewInterface.js";
import { AccountType } from "../../../database/models/Account.js";
import ChairReviewStrategy from "./impl/ChairReviewStrategy.js";
import ReviewRepository from "../../repository/ReviewRepository.js";

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
        const strategy : ReviewInterface = this.getStrategy(accountType);
        return strategy.getComments(paperId);
    }

    async getReviews(accountType : AccountType, paperId : number) {
        const strategy : ReviewInterface = this.getStrategy(accountType);
        return strategy.getReviews(paperId);
    }

    async addReviewForPaper(reviewScore : number, paperId : number, reviewerId : number)  {

        this.reviewRepository.insertReview(reviewScore, paperId, reviewerId);
    }
}