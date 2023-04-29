
import AccountRepository from "@app/paperpal/repository/AccountRepository";
import PaperRepository from "@app/paperpal/repository/PaperRepository";
import ReviewRepository from "@app/paperpal/repository/ReviewRepository";
import { ConferencePhase } from "@app/paperpal/types/ConferencePhase";
import ForbiddenException from "@exception/ForbiddenException";
import NotFoundException from "@exception/NotFoundException";
import Account from "@model/Account";
import ReviewStrategy from "@service/review/interfaces/ReviewStrategy";
import { inject, injectable } from "inversify";

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
        const author = await this.accountRepository.getAuthor(accountId);
        const paper = await this.paperRepository.getPaper(paperId);

        if(!paper) throw new NotFoundException("Paper not found");
        if(!author) throw new NotFoundException("Author not found");
        
        return (paper.authorid == author.id); 
    }
}