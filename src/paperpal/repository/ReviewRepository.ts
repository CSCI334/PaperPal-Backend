import { inject, injectable } from "inversify";
import DbService from "../../database/db.js";

@injectable()
export default class ReviewRepository{
    constructor(@inject(DbService) private readonly db: DbService) {}
    
    async insertReview(reviewScore : number, paperId : number, reviewerid : number) {
        return;
    }

    async deleteReview() {
        return;
    }

    async getAllReviewForPaper(){
        return;
    }

    async updateReview() {
        return;
    }

    async addReviewOfReview() {
        return;
    }
}