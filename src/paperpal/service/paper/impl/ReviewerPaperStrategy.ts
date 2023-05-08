
import AccountRepository from "@app/paperpal/repository/AccountRepository";
import PaperRepository from "@app/paperpal/repository/PaperRepository";
import ReviewRepository from "@app/paperpal/repository/ReviewRepository";
import { ConferencePhase } from "@app/paperpal/types/ConferencePhase";
import ForbiddenException from "@exception/ForbiddenException";
import NotFoundException from "@exception/NotFoundException";
import Account from "@model/Account";
import BidRepository from "@repository/BidRepository";
import PaperStrategy from "@service/paper/interfaces/PaperStrategy";
import { inject, injectable } from "inversify";
@injectable()
export default class ReviewerPaperStrategy implements PaperStrategy {
    constructor(
        @inject(AccountRepository) private readonly accountRepository : AccountRepository,
        @inject(PaperRepository) private readonly paperRepository : PaperRepository,
        @inject(ReviewRepository) private readonly reviewRepository : ReviewRepository,
        @inject(BidRepository) private readonly bidRepository : BidRepository
    ) {}
    
    async getAvailablePapers(user: Account, phase: ConferencePhase) {
        switch(phase) {
        case ConferencePhase.Bidding:
            // For bidding phase, return a nice and joined table of Papers and Bids, 
            // some values such as unbidded papers need to be populated when returning

            // Will only return a list of title, co-authors and date. Will not return the file itself.
            return await this.getBiddablePapers(user);
        default:
            // For any other phase, return all allocated papers
            return await this.getAllocatedPaper(user);
        }
    }

    // Reviewer can always get their allocated papers
    async getPaperFileLocation(user: Account, paperId: number) {
        const paper = await this.paperRepository.getPaper(paperId);
        if(!paper) throw new NotFoundException("Paper not found");

        const isPaperOwned = await this.reviewRepository.doesPaperBelongToReviewer(user.id, paperId);
        if(!isPaperOwned) throw new ForbiddenException("Reviewer does not own that paper");

        return paper.filelocation;
    }

    async getAllocatedPaper(user: Account) {
        const reviewer = await this.accountRepository.getReviewer(user.id);
        const data = await this.paperRepository.getAllocatedPapersForReviewer(reviewer.id);
        if(!data) throw new NotFoundException("Reviewer has no allocated paper");
        return data;
    }

    async getBiddablePapers(user: Account) {
        const reviewer = await this.accountRepository.getReviewer(user.id);
        const data = await this.bidRepository.getPapersAndBids(reviewer.id);
        return data;
    }
}