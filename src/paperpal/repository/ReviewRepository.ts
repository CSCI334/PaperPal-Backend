import { inject, injectable } from "inversify";
import DbService from "../../database/db.js";
import Review from "../../database/models/Review.js";
import Comment from "../../database/models/Comment.js";

@injectable()
export default class ReviewRepository{
    constructor(@inject(DbService) private readonly db: DbService) {}
    
    async getReviewFromAccountAndPaper(reviewerId: number, paperId: number) : Promise<Review> {
        return;
    }

    async insertReview(review : Partial<Review>) {
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
        return;
    }

    async getAllReviewsForPaper(paperId: number): Promise<Review[]>{
        return;
    }
    
    async getAllCommentsForPaper(paperId: number): Promise<Comment[]> {
        return;
    }

    async updateReview() {
        return;
    }

    async addReviewRating() {
        return;
    }
    
}