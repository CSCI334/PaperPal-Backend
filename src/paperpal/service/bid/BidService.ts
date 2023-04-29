import { POINTS_PER_PAPER } from "@app/constants/AppConstants";
import AccountRepository from "@app/paperpal/repository/AccountRepository";
import BidRepository from "@app/paperpal/repository/BidRepository";
import BidDTO from "@app/paperpal/types/dto/BidDTO";
import ForbiddenException from "@exception/ForbiddenException";
import Reviewer from "@model/Reviewer";
import { inject, injectable } from "inversify";

@injectable()
export default class BidService {
    constructor(
        @inject(BidRepository) private readonly bidRepository : BidRepository,
        @inject(AccountRepository) private readonly accountRepository : AccountRepository,
    ) {} 
    async getBids(accountId: number) {
        return this.bidRepository.getBidsForAccount(accountId);
    }
    async setWorkload(accountId: number, amountOfPaper: number) {
        const reviewer: Reviewer = await this.accountRepository.getReviewer(accountId); 
        if(!reviewer) throw new ForbiddenException("User is not a reviewer");
        const data = this.accountRepository.updateReviewer(reviewer.id, {
            bidpoints: amountOfPaper * POINTS_PER_PAPER,
            workload: amountOfPaper,
        });
        return data;
    }
    async addBid(accountId: number, bidDTO : BidDTO) {
        const reviewer: Reviewer = await this.accountRepository.getReviewer(accountId); 
        if(!reviewer) throw new ForbiddenException("User is not a reviewer");

        return this.bidRepository.insertBid(reviewer.id, bidDTO.paperId, bidDTO.bidAmount);
    }
}