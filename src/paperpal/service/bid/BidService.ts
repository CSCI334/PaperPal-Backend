import { inject } from "inversify";
import BidRepository from "../../repository/BidRepository.js";
import AccountRepository from "../../repository/AccountRepository.js";
import BidDTO from "../../types/dto/BidDTO.js";
import { POINTS_PER_PAPER } from "../../../constants/AppConstants.js";
import AccountService from "../account/AccountService.js";
import Reviewer from "../../../database/models/Reviewer.js";
import NotFoundException from "../../../exceptions/NotFoundException.js";
import ForbiddenException from "../../../exceptions/ForbiddenException.js";

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