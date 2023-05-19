import { ConferencePhase } from "@app/paperpal/types/ConferencePhase";
import Account from "@model/Account";
import Comment from "@model/Comment";
import Review from "@model/Review";

// The way you get comments and reviews changes drastically according to accountTypes
interface ReviewStrategy{
    getComments(user: Account, paperId: number, phase? : ConferencePhase) : Promise<Comment[]>;
    getReviews(user: Account, paperId: number, phase? : ConferencePhase) : Promise<Review[]>;
}

export default ReviewStrategy;