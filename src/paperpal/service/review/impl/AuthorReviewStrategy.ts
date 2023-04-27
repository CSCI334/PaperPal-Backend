import { inject, injectable } from "inversify";
import Comment from "../../../../database/models/Comment.js";
import ReviewStrategy from "../interfaces/ReviewStrategy.js";
import Review from "../../../../database/models/Review.js";
import { ConferencePhase } from "../../../types/ConferencePhase.js";
import Account from "../../../../database/models/Account.js";
import ReviewRepository from "../../../repository/ReviewRepository.js";
import AccountRepository from "../../../repository/AccountRepository.js";

@injectable()
export default class AuthorReviewStrategy implements ReviewStrategy {
    constructor(
        @inject(AccountRepository) private readonly accountRepository: AccountRepository,
        @inject(ReviewRepository) private readonly reviewRepository : ReviewRepository,
        
    ) {}
    // Author can only get reviews and comments of their own papers, they can only do this after announcement
    async getComments(user: Account, paperId: number, phase? : ConferencePhase) {
        const commentList = this.reviewRepository.getAllCommentsForPaper(paperId);
        return commentList;
    }

    async getReviews(user: Account, paperId: number, phase? : ConferencePhase) {
        const reviewList : Review[] = [];
        return reviewList;
    }
}