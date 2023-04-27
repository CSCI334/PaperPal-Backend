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
            // TODO : For bidding phase, return a nice and joined table of Papers and Bids, 
            // might need to populate some values when returning
            // Will only return simple title, co-authors, and not file location
            
            return await this.getBiddablePapers(user);
        case ConferencePhase.Review:
            // TODO : For review phase, return all allocated papers
            return await this.getAllocatedPaper(user);
        default:

        }
        
        return {};
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