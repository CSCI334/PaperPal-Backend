import { inject, injectable } from "inversify";
import ReviewStrategy from "../interfaces/ReviewStrategy.js";
import { ConferencePhase } from "../../../types/ConferencePhase.js";
import ForbiddenException from "../../../../exceptions/ForbiddenException.js";
import AccountService from "../../account/AccountService.js";
import Account from "../../../../database/models/Account.js";
import ReviewRepository from "../../../repository/ReviewRepository.js";
import NotFoundException from "../../../../exceptions/NotFoundException.js";
import Comment from "../../../../database/models/Comment.js";

@injectable()
export default class ReviewerReviewStrategy implements ReviewStrategy {
    constructor(
        @inject(AccountService) private readonly accountService: AccountService,
        @inject(ReviewRepository) private readonly reviewRepository : ReviewRepository,

    ) {}
    
    // Reviewer can only get comments if they have submitted their own review, and phase is currently or has passed review
    async getComments(user: Account, paperId: number, phase: ConferencePhase): Promise<Comment[]> {
        if(phase < ConferencePhase.Review) throw new ForbiddenException("Conference is not in review phase yet");
        if(!this.reviewerHasSubmittedReviewForPaper(user.id, paperId)) throw new ForbiddenException("Reviewer cannot view comments before they have submitted");

        return this.reviewRepository.getAllCommentsForPaper(paperId);
    }

    // Reviewer can only get reviews if they have submitted their own review, and phase is currently or has passed review
    async getReviews(user: Account, paperId: number, phase : ConferencePhase) {
        if(phase < ConferencePhase.Review) throw new ForbiddenException("Conference is not in review phase yet");

        // TODO: user.id is not reviewerId nor authorId!! How could I have done this
        if(!this.reviewerHasSubmittedReviewForPaper(user.id, paperId)) throw new ForbiddenException("Reviewer cannot view comments before they have submitted");
        
        return this.reviewRepository.getAllReviewsForPaper(paperId);
    }

    async reviewerHasSubmittedReviewForPaper(accountId: number, paperId: number): Promise<boolean> {
        const review = await this.reviewRepository.getReviewFromAccountAndPaper(accountId, paperId);
        if(!review) throw new NotFoundException("Review not found");
        
        return review.paperRating === undefined;
    }
}