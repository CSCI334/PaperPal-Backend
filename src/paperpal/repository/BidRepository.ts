import { inject, injectable } from "inversify";
import DbService from "../../database/db.js";

@injectable()
export default class BidRepository{
    constructor(@inject(DbService) private readonly db: DbService) {}

    async insertBid(reviewerId: number, paperId: number, bidAmount: number){
        return;
    }

    async getBidsForAccount(reviewerId: number) {
        return;
    }
}