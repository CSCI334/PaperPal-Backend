import { inject, injectable } from "inversify";
import DbService from "../../database/db.js";
import Review from "../../database/models/Review.js";
import Comment from "../../database/models/Comment.js";

@injectable()
export default class ReviewRepository{
    constructor(@inject(DbService) private readonly db: DbService) {}
    
    // Note that this is accountId and not reviewer id. Join sequence are accountId > reviewerId > paperId
    async getReviewFromAccountAndPaper(accountId: number, paperId: number) : Promise<Review> {
        `SELECT * 
        FROM account
        INNER JOIN reviewer ON account.id = reviewer.accountid
        INNER JOIN paper ON reviewer.accountid = paper.id;
`
        return;
    }

    async insertReview(review : Partial<Review>) {
        `INSERT INTO review (paperrating, reviewrating, reviewerid, paperid)
        VALUES (paperrating, reviewrating, reviewerid, paperid);`
        return;
    }

    async setPaperRating(reviewerId: number, paperId: number, rating: number) {
        `UPDATE review
        SET paperrating = INT
        WHERE id = INT;`
        return;
    }

    async setReviewRating(reviewerId: number, paperId: number, rating: number) {
        `UPDATE review
        SET reviewrating = INT
        WHERE id = INT;`
        return;
    }

    async addComment(reviewerId: number, paperId: number, comment: string): Promise<Comment> {
        `INSERT INTO comment (comment, paperid, reviewerid)
        VALUES('string', INT, INT);`
        return;
    }

    async deleteReview() {
        `DELETE FROM review
        WHERE review.id = INT;`
        return;
    }

    async getAllCommentsForPaper(paperId: number): Promise<Comment[]> {
        `SELECT *
        FROM comment
        LEFT JOIN paper ON comment.paperid = paper.id;`
        return;
    }
    async getAllReviewsForPaper(paperId: number): Promise<Review[]>{
        `SELECT * 
        FROM review 
        LEFT JOIN paper ON review.paperid = paper.id;`;
        return;
    }

    async updateReview() {
        `UPDATE review
        SET paperrating = INT, reviewrating = INT, 
        reviewerrating = INT, paperid = INT
        WHERE id = INT;`
        return;
    }

    async addReviewRating() {
        `INSERT INTO review (reviewrating)
        VALUES (INT);`
        return;
    }
    
}
