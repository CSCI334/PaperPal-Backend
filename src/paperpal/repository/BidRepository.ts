import DbService from "@app/database/db";
import Bid from "@model/Bid";
import { LooseObject } from "@utils/LooseObject";
import { inject, injectable } from "inversify";

@injectable()
export default class BidRepository{
    constructor(
        @inject(DbService) private readonly db: DbService
    ) {}

    async insertBid(reviewerId: number, paperId: number, bidAmount: number){
        const { rows } = await this.db.query(
            `INSERT INTO bids (bidamount, reviewerid, paperid)
            VALUES ($3, $1, $2)`,
            [reviewerId, paperId, bidAmount]
        );
        return rows[0] as Bid;
    }

    async getBidsForAccount(reviewerId: number) {
        const { rows } = await this.db.query(
            `SELECT *
            FROM bids
            WHERE id = $1`,
            [reviewerId]
        );
        return rows as Bid[];
    }

    async getPapersAndBids(reviewerId: number) {
        const { rows } = await this.db.query(
            `SELECT paper.id, bids.bidamount, paper.title, paper.coauthors, paper.paperstatus
            FROM bids
            RIGHT JOIN paper ON paper.id = bids.paperid AND bids.reviewerid = $1`,
            [reviewerId]
        );
        return rows as LooseObject[];
    }
}
