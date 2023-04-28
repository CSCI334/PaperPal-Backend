import { inject, injectable } from "inversify";
import PaperStrategy from "../interfaces/PaperStrategy.js";
import PaperRepository from "../../../repository/PaperRepository.js";
import ConferenceService from "../../conference/ConferenceService.js";
import { ConferencePhase } from "../../../types/ConferencePhase.js";
import Account from "../../../../database/models/Account.js";
import NotFoundException from "../../../../exceptions/NotFoundException.js";

@injectable()
export default class ReviewerPaperStrategy implements PaperStrategy {
    
    constructor(
        @inject(ConferenceService) private readonly conferenceService : ConferenceService,
        @inject(PaperRepository) private readonly paperRepository : PaperRepository) {}
    
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


    async getPaperFile(user: Account, paperId: number, phase : ConferencePhase) {
        switch(phase) {
        case ConferencePhase.Bidding:
            return {};
        case ConferencePhase.Review:
            return {};
        default:
            
        }
        return {};
    }

    async getAllocatedPaper(user: Account) {
        const data = this.paperRepository.getAllocatedPaperForReviewer(user.id);
        if(!data) throw new NotFoundException("Reviewer has no allocated paper");
        return data;
    }

    async getBiddablePapers(user: Account) {
        const data = this.paperRepository.getPapersAndBids(user.conferenceid, user.id);
        return data;
    }
}