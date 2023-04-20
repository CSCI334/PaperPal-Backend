import { inject, injectable } from "inversify";
import DbService from "../../database/db.js";
import Account from "../../database/models/Account.js";
import { PgErrorMap } from "../../database/types.js";

@injectable()
export default class ReviewRepository{
    constructor(@inject(DbService) private readonly db: DbService) {}
    
    async insertReview() {
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
}