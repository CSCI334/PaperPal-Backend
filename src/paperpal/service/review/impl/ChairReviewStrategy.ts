import { inject, injectable } from "inversify";
import ReviewStrategy from "../interfaces/ReviewStrategy.js";
import Account from "../../../../database/models/Account.js";
import ReviewRepository from "../../../repository/ReviewRepository.js";

@injectable()
export default class ChairReviewStrategy implements ReviewStrategy {
    constructor(
        @inject(ReviewRepository) private readonly reviewRepository: ReviewRepository,
    ) {}

    // Chair can get comments and reviews anytime
    async getComments(user: Account, paperId: number) {
        return this.reviewRepository.getAllCommentsForPaper(paperId);
    }
    // 
    async getReviews(user: Account, paperId: number) {
        const reviews = this.reviewRepository.getAllReviewsForPaper(paperId);
        return (await reviews).filter(i => i.paperrating !== undefined);
    }
}