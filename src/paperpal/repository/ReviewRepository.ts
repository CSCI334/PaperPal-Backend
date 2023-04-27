import { inject, injectable } from "inversify";
import DbService from "../../database/db.js";
import Review from "../../database/models/Review.js";
import Comment from "../../database/models/Comment.js";

@injectable()
export default class ReviewRepository{
    constructor(@inject(DbService) private readonly db: DbService) {}
    
    async insertReview(review : Partial<Review>) {
        `INSERT INTO review (reviewerid, paperid, score)
        VALUES (reviewerid, paperid, score);`
        return;
    }

    async setPaperRating(reviewerId: number, paperId: number, rating: number) {
        return;
    }

    async setReviewRating(reviewerId: number, paperId: number, rating: number) {
        return;
    }

    async addComment(reviewerId: number, paperId: number, comment: string): Promise<Comment> {
        return;
    }

    async deleteReview() {
        `DELETE FROM review
        WHERE colData = valData;`
        return;
    }

    async getAllReviewForPaper(){
        `SELECT * 
        FROM review 
        LEFT JOIN paper ON review.paperid = paper.id;`
        return;
    }

    async updateReview() {
        `UPDATE review
        SET col1 = val1, col2 =val2
        WHERE colData = valData;`
        return;
    }

    async addReviewRating() {
        return;
    }
}
