import { injectable } from "inversify";
import ReviewStrategy from "../interfaces/ReviewStrategy.js";
import Review from "../../../../database/models/Review.js";

@injectable()
export default class AuthorReviewStrategy implements ReviewStrategy {
    async getComments(id: number) {
        const commentList : Comment[] = [];
        return commentList;
    }
    async getReviews(id: number) {
        const reviewList : Review[] = [];
        return reviewList;
    }
}