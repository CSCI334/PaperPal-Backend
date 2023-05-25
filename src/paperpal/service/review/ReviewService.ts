import PaperRepository from "@app/paperpal/repository/PaperRepository";
import ReviewRepository from "@app/paperpal/repository/ReviewRepository";
import { ConferencePhase } from "@app/paperpal/types/ConferencePhase";
import CommentDTO from "@app/paperpal/types/dto/CommentDTO";
import ReviewDTO from "@app/paperpal/types/dto/PaperRatingDTO";
import ReviewRatingDTO from "@app/paperpal/types/dto/ReviewRatingDTO";
import ForbiddenException from "@exception/ForbiddenException";
import NotAuthenticatedException from "@exception/NotAuthenticatedException";
import { AccountType } from "@model/Account";
import AccountRepository from "@repository/AccountRepository";
import ConferenceRepository from "@repository/ConferenceRepository";
import AccountService from "@service/account/AccountService";
import ConferenceUtils from "@service/conference/ConferenceUtils";
import AuthorReviewStrategy from "@service/review/impl/AuthorReviewStrategy";
import ChairReviewStrategy from "@service/review/impl/ChairReviewStrategy";
import ReviewerReviewStrategy from "@service/review/impl/ReviewerReviewStrategy";
import { inject, injectable } from "inversify";

@injectable()
export default class ReviewService {
    constructor(
        @inject(AuthorReviewStrategy) private readonly authorReviewStrategy : AuthorReviewStrategy,
        @inject(ReviewerReviewStrategy) private readonly reviewerReviewStrategy : ReviewerReviewStrategy,
        @inject(ChairReviewStrategy) private readonly chairReviewStrategy : ChairReviewStrategy,

        @inject(PaperRepository) private readonly paperRepository : PaperRepository,
        @inject(AccountRepository) private readonly accountRepository : AccountRepository,
        @inject(ReviewRepository) private readonly reviewRepository : ReviewRepository,
        @inject(ConferenceRepository) private readonly conferenceRepository : ConferenceRepository,
        @inject(AccountService) private readonly accountService : AccountService,
    ) {}

    private getStrategy(accountType : AccountType) {
        if(accountType === "AUTHOR")
            return this.authorReviewStrategy;
        else if(accountType === "REVIEWER")
            return this.reviewerReviewStrategy;
        else if(accountType === "CHAIR")
            return this.chairReviewStrategy;
        throw new NotAuthenticatedException("Account type not known");
    }
        
    async getComments(accountId: number, paperId : number) {
        const user = await this.accountService.getUser(accountId);
        const strategy = this.getStrategy(user.accounttype);
        const lastConference = await this.conferenceRepository.getLastConference();

        const phase: ConferencePhase = await ConferenceUtils.getConferencePhase(lastConference);

        if(!(await this.paperRepository.isPaperInConference(paperId, user.conferenceid))) 
            throw new ForbiddenException("Paper does not belong to your conference");

        return strategy.getComments(user, paperId, phase);
    }

    async getReviews(accountId: number, paperId : number) {
        const user = await this.accountService.getUser(accountId);
        const strategy = this.getStrategy(user.accounttype);
        const lastConference = await this.conferenceRepository.getLastConference();

        const phase: ConferencePhase = ConferenceUtils.getConferencePhase(lastConference);
        
        if(!(await this.paperRepository.isPaperInConference(paperId, user.conferenceid))) 
            throw new ForbiddenException("Paper does not belong to your conference");

        return strategy.getReviews(user, paperId, phase);
    }
    
    async addComments(accountId : number, commentDTO : CommentDTO) {
        const reviewer = await this.accountRepository.getReviewerByAccountId(accountId);
        const data = await this.reviewRepository.addComment(reviewer.id, commentDTO.paperId, commentDTO.comment);
        return data;
    }
    
    async addReview(accountId : number, ratingDTO : ReviewDTO)  {
        const reviewer = await this.accountRepository.getReviewerByAccountId(accountId);
        const data = await this.reviewRepository.setReview(reviewer.id, ratingDTO.paperId, ratingDTO.rating, ratingDTO.review);
        return data;
    }
    
    async addRatingOfReview(ratingDTO : ReviewRatingDTO){
        const data = await this.reviewRepository.setReviewRating(ratingDTO.reviewId, ratingDTO.rating);
        return data;
    }
}