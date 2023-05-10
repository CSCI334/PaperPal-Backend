import DbService from "@app/database/db";
import { PgErrorMap } from "@app/database/types";
import Bid from "@model/Bid";
import Review from "@model/Review";
import { LooseObject } from "@utils/LooseObject";
import { inject, injectable } from "inversify";

@injectable()
export default class BidRepository{
    constructor(
        @inject(DbService) private readonly db: DbService
    ) {}
        
    async insertBid(reviewerId: number, paperId: number, bidAmount: number){
        const constraint: PgErrorMap = new Map();
        constraint.set("uniquereviewerandbid", "Cannot insert duplicate bids.");

        const { rows } = await this.db.query(
            `INSERT INTO bids (bidamount, reviewerid, paperid)
            VALUES ($3, $1, $2)`,
            [reviewerId, paperId, bidAmount],
            constraint
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

    async getSortedBids(conferenceId : number): Promise<LooseObject[]>{
        const { rows } = await this.db.query(
            `SELECT paperconference.paperid, reviewer.id as reviewerId, paperconference.title, bids.bidamount, reviewer.paperworkload
            FROM paperconference
            LEFT JOIN bids ON paperconference.paperId=bids.paperId
            LEFT JOIN reviewer ON reviewer.id = bids.reviewerid
            WHERE conferenceId=$1 AND reviewer.paperworkload > 0
            ORDER BY bids.bidamount DESC, reviewer.paperworkload DESC;`,
            [conferenceId]
        );
        return rows as LooseObject[];
    }

    async getAllocatedPaperCount(reviewerId: number) {
        const { rows } = await this.db.query(
            `SELECT COUNT(*)
            FROM review
            JOIN reviewer ON reviewer.id=review.reviewerid
            WHERE review.reviewerId=$1`,
            [reviewerId]
        );
        return rows[0].count as number;
    }

    // Create empty Review column with paperId and reviewerId
    async allocatePaperToReviewer(paperId: number, reviewerId: number){
        const constraint: PgErrorMap = new Map();
        constraint.set("uniquereviewerandpaper", "Cannot insert duplicate allocation.");

        const { rows } = await this.db.query(
            `INSERT INTO review(paperId, reviewerId)
            VALUES ($1, $2)
            RETURNING *`,
            [paperId, reviewerId],
            constraint
        );
        return rows[0] as Review;
    }
}
    