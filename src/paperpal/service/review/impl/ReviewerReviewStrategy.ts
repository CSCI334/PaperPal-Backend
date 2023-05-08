
import ReviewRepository from "@app/paperpal/repository/ReviewRepository";
import { ConferencePhase } from "@app/paperpal/types/ConferencePhase";
import ForbiddenException from "@exception/ForbiddenException";
import NotFoundException from "@exception/NotFoundException";
import Account from "@model/Account";
import Comment from "@model/Comment";
import AccountService from "@service/account/AccountService";
import ReviewStrategy from "@service/review/interfaces/ReviewStrategy";
import { inject, injectable } from "inversify";
@injectable()
export default class ReviewerReviewStrategy implements ReviewStrategy {
    constructor(
        @inject(AccountService) private readonly accountService: AccountService,
        @inject(ReviewRepository) private readonly reviewRepository : ReviewRepository,
    ) {}
    
    // Reviewer can only get comments if they have submitted their own review, and phase is currently or has passed review
    async getComments(user: Account, paperId: number, phase: ConferencePhase): Promise<Comment[]> {
        if(phase < ConferencePhase.Review) 
            throw new ForbiddenException("Conference is not in review phase yet");
        if(!(await this.reviewerHasSubmittedReviewForPaper(user.id, paperId))) 
            throw new ForbiddenException("Reviewer cannot view comments before they have submitted");

        return await this.reviewRepository.getAllCommentsForPaper(paperId);
    }

    // Reviewer can only get reviews if they have submitted their own review, and phase is currently or has passed review
    async getReviews(user: Account, paperId: number, phase : ConferencePhase) {
        if(phase < ConferencePhase.Review) 
            throw new ForbiddenException("Conference is not in review phase yet");
        if(!(await this.reviewerHasSubmittedReviewForPaper(user.id, paperId))) 
            throw new ForbiddenException("Reviewer cannot view comments before they have submitted");
        
        return this.reviewRepository.getAllReviewsForPaper(paperId);
    }

    async reviewerHasSubmittedReviewForPaper(accountId: number, paperId: number): Promise<boolean> {
        const review = await this.reviewRepository.getReviewFromAccountAndPaper(accountId, paperId);
        if(!review) throw new NotFoundException("Review not found");
        
        // If there is no rating, reviewer has not submitted review 
        return review.paperrating !== undefined;
    }
}