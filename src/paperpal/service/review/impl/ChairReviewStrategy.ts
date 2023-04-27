import { injectable } from "inversify";
import Comment from "../../../../database/models/Comment.js";
import ReviewStrategy from "../interfaces/ReviewStrategy.js";
import Review from "../../../../database/models/Review.js";
import { ConferencePhase } from "../../../types/ConferencePhase.js";
import Account from "../../../../database/models/Account.js";

@injectable()
export default class ChairReviewStrategy implements ReviewStrategy {
    async getComments(user: Account, phase? : ConferencePhase) {
        const commentList : Comment[] = [];
        return commentList;
    }
    async getReviews(user: Account, phase? : ConferencePhase) {
        const reviewList : Review[] = [];
        return reviewList;
    }
}