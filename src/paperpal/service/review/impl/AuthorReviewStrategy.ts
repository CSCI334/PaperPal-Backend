import { injectable } from "inversify";
import ReviewInterface from "../ReviewInterface.js";

@injectable()
export default class AuthorReviewStrategy implements ReviewInterface {
    async getComments(id: number) {
        return "";
    }
    async getReviews(id: number) {
        return "";
    }
}