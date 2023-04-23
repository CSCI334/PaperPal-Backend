import { injectable } from "inversify";
import ReviewStrategy from "../interfaces/ReviewStrategy.js";

@injectable()
export default class AuthorReviewStrategy implements ReviewStrategy {
    async getComments(id: number) {
        return "";
    }
    async getReviews(id: number) {
        return "";
    }
}