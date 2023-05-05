import DbService from "@app/database/db";
import { inject, injectable } from "inversify";

@injectable()
export default class BidRepository{
    constructor(@inject(DbService) private readonly db: DbService) {}

    async insertBid(reviewerId: number, paperId: number, bidAmount: number){
        `INSERT INTO bids (bidamount, reviewid, paperid)
        VALUES (bidamount, reviewid, paperid)`;
        return;
    }

    async getBidsForAccount(reviewerId: number) {
        `SELECT *
        FROM bids
        WHERE id = reviewerId`;
        return;
    }
}
