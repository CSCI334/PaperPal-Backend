
import ReviewRepository from "@app/paperpal/repository/ReviewRepository";
import Account from "@model/Account";
import ReviewStrategy from "@service/review/interfaces/ReviewStrategy";
import { inject, injectable } from "inversify";

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