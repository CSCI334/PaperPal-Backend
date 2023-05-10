import { POINTS_PER_PAPER } from "@app/constants/AppConstants";
import AccountRepository from "@app/paperpal/repository/AccountRepository";
import BidRepository from "@app/paperpal/repository/BidRepository";
import BidDTO from "@app/paperpal/types/dto/BidDTO";
import ForbiddenException from "@exception/ForbiddenException";
import InvalidInputException from "@exception/InvalidInputException";
import Reviewer from "@model/Reviewer";
import ConferenceRepository from "@repository/ConferenceRepository";
import PaperRepository from "@repository/PaperRepository";
import { inject, injectable } from "inversify";

@injectable()
export default class BidService {
    constructor(
        @inject(BidRepository) private readonly bidRepository : BidRepository,
        @inject(AccountRepository) private readonly accountRepository : AccountRepository,
        @inject(ConferenceRepository) private readonly conferenceRepository : ConferenceRepository,
        @inject(PaperRepository) private readonly paperRepository : PaperRepository
    ) {} 
    
    async getBids(accountId: number) {
        return this.bidRepository.getBidsForAccount(accountId);
    }
    
    async setWorkload(accountId: number, amountOfPaper: number) {
        const reviewer: Reviewer = await this.accountRepository.getReviewer(accountId); 
        if(!reviewer) throw new ForbiddenException("User is not a reviewer");
        const data = this.accountRepository.updateReviewer(reviewer.id, {
            bidpoints: amountOfPaper * POINTS_PER_PAPER,
            paperworkload: amountOfPaper,
        });
        return data;
    }
    
    async addBid(accountId: number, bidDTO : BidDTO) {
        const reviewer: Reviewer = await this.accountRepository.getReviewer(accountId); 
        if(!reviewer) throw new ForbiddenException("User is not a reviewer");

        const remainingPoints = reviewer.bidpoints - bidDTO.bidAmount;
        if(remainingPoints < 0) throw new InvalidInputException("Bid exceeds remaining points");
        await this.accountRepository.updateReviewer(reviewer.id, {
            bidpoints: remainingPoints
        });

        return this.bidRepository.insertBid(reviewer.id, bidDTO.paperId, bidDTO.bidAmount);
    }
    
    // Automatically allocates paper to all reviewer
    // Papers are allocated in a round robin manner
    // Iterate through paper and allocates them until all reviewer has a workload of 0

    // Priority for paper allocation goes:
    // Highest bid > Highest workload > Not allocated

    // TODO
    async allocateAllPapers() {
        const conference = await this.conferenceRepository.getLastConference();

        const allPapers = await this.paperRepository.getAllPapersInConference(conference.id);
        
        // Iterate through all the papers in conference
        // 1. Find if paper has a bidder, find only legitimate candidate (that still has workload > 0)
        // 2. Sort bidder by the amount that they bid on, 
        // 3. Get all reviewerId by highest bid, pick highest workload if multiple
        const sumOfEveryWorkload = 0;

        // It's a bit disgusting but i'm not going to optimize this
        while(sumOfEveryWorkload > 0) {
            for(const paper of allPapers) {
                
                // Paper allocation logic goes here
                // allocate(paper)
            }
        }
    }
}