import DbService from "@app/database/db";
import Comment from "@model/Comment";
import Review from "@model/Review";
import { injectable, inject } from "inversify";

@injectable()
export default class ReviewRepository{
    constructor(@inject(DbService) private readonly db: DbService) {}
    
    // Note that this is accountId and not reviewer id. Join sequence are accountId > reviewerId > paperId
    async getReviewFromAccountAndPaper(accountId: number, paperId: number) : Promise<Review> {
        const { rows } = await this.db.query(
            `SELECT * 
            FROM account
            JOIN reviewer ON reviewer.accountId = account.id 
            JOIN review ON review.reviewerId = reviewer.id
            WHERE account.id=$1 AND review.paperId = $2`,
            [accountId, paperId]
        );
        return rows[0] as Review;
    }

    async doesPaperBelongToReviewer(accountId: number, paperId: number) : Promise<boolean> {
        const { rows } = await this.db.query(
            `SELECT
            CASE WHEN EXISTS(
                SELECT * 
                FROM account
                INNER JOIN reviewer ON reviewer.accountId = $1 
                INNER JOIN review ON review.reviewerId = reviewer.id
                WHERE review.paperId = $2
            )
            THEN true
            ELSE false
            END`,
            [accountId, paperId]
        );
        return rows[0].case;
    }

    async insertReview(review : Partial<Review>) {
        const { rows } = await this.db.query(
            `INSERT INTO review (paperrating, reviewrating, reviewerid, paperid)
            VALUES ($1, $2, $3, $4);`,
            [review.paperrating, review.reviewrating, review.reviewerid, review.paperid]
        );
        return rows[0] as Review;
    }

    async setReview(reviewerId: number, paperId: number, rating: number, review: string) {
        const { rows } = await this.db.query(
            `UPDATE review
            SET paperrating=$3, review=$4
            WHERE reviewerId=$1 AND paperId=$2
            RETURNING *`,
            [reviewerId, paperId, rating, review]
        );
        return rows[0] as Review;
    }

    async setReviewRating(reviewerId: number, paperId: number, rating: number) {
        const { rows } = await this.db.query(
            `UPDATE review
            SET reviewrating=$3
            WHERE reviewerId=$1 AND paperId=$2
            RETURNING *`,
            [reviewerId, paperId, rating]
        );
        return rows[0] as Review;
    }

    async addComment(reviewerId: number, paperId: number, comment: string): Promise<Comment> {
        const { rows } = await this.db.query(
            `INSERT INTO comment (paperid, reviewerId, comment)
            VALUES($1, $2, $3);`,
            [paperId, reviewerId, comment]
        );
        return rows[0] as Comment;
    }

    
    async getAllCommentsForPaper(paperId: number): Promise<Comment[]> {
        const { rows } = await this.db.query(
            `SELECT *
            FROM comment
            LEFT JOIN paper ON comment.paperid=$1;`,
            [paperId]
        );
        return rows as Comment[];
    }
        
    async getAllReviewsForPaper(paperId: number): Promise<Review[]>{
        const { rows } = await this.db.query(
            `SELECT review.*, account.username as reviewername
            FROM review 
            JOIN paper ON paper.id=$1
            JOIN reviewer ON reviewer.id = review.reviewerid
            JOIN account ON reviewer.accountid = account.id`,
            [paperId]
        );
        return rows as Review[];
    }
        
    async deleteReview() {
        `DELETE FROM review
        WHERE review.id = INT;`;
        return;
    }
    
    async updateReview() {
        `UPDATE review
        SET paperrating = INT, reviewrating = INT, 
        reviewerrating = INT, paperid = INT
        WHERE id = INT;`;
        return;
    }    
}
