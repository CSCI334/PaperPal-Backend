import Account from "../../../../database/models/Account.js";
import Comment from "../../../../database/models/Comment.js";
import Review from "../../../../database/models/Review.js";
import { ConferencePhase } from "../../../types/ConferencePhase.js";

// The way you get comments and reviews changes drastically according to accountTypes
interface ReviewStrategy{
    getComments(user: Account, paperId: number, phase? : ConferencePhase) : Promise<Comment[]>;
    getReviews(user: Account, paperId: number, phase? : ConferencePhase) : Promise<Review[]>;
}

export default ReviewStrategy;