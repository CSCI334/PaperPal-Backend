import { inject, injectable } from "inversify";
import ReviewStrategy from "../interfaces/ReviewStrategy.js";
import { ConferencePhase } from "../../../types/ConferencePhase.js";
import Account from "../../../../database/models/Account.js";
import ReviewRepository from "../../../repository/ReviewRepository.js";
import AccountRepository from "../../../repository/AccountRepository.js";
import ForbiddenException from "../../../../exceptions/ForbiddenException.js";
import PaperRepository from "../../../repository/PaperRepository.js";
import NotFoundException from "../../../../exceptions/NotFoundException.js";

@injectable()
export default class AuthorReviewStrategy implements ReviewStrategy {
    constructor(
        @inject(AccountRepository) private readonly accountRepository: AccountRepository,
        @inject(ReviewRepository) private readonly reviewRepository: ReviewRepository,
        @inject(PaperRepository) private readonly paperRepository: PaperRepository
    ) {}

    // Author can only get reviews and comments of their own papers, they can only do this after announcement
    async getComments(user: Account, paperId: number, phase : ConferencePhase) {
        if(phase != ConferencePhase.Announcement) throw new ForbiddenException("Conference is not in announcement phase");
        if(!(await this.authorOwnsPaper(user.id, paperId))) throw new ForbiddenException("Author does not own paper");

        const commentList = this.reviewRepository.getAllCommentsForPaper(paperId);
        return commentList;
    }

    async getReviews(user: Account, paperId: number, phase : ConferencePhase) {
        if(phase != ConferencePhase.Announcement) throw new ForbiddenException("Conference is not in announcement phase");
        if(!(await this.authorOwnsPaper(user.id, paperId))) throw new ForbiddenException("Author does not own paper");
        
        const reviewList = this.reviewRepository.getAllReviewsForPaper(paperId);
        return reviewList;
    }

    async authorOwnsPaper(accountId: number, paperId: number) {
        const authorId = await this.accountRepository.getAuthorIdFromAccount(accountId);
        const paper = await this.paperRepository.getPaper(paperId);

        if(!paper) throw new NotFoundException("Paper not found");
        if(!authorId) throw new NotFoundException("Author not found");
        
        return (paper.authorid == authorId); 
    }
}