import Review from "../../../../database/models/Review.js";

// The way you get comments and reviews changes drastically according to accountTypes
interface ReviewStrategy{
    getComments(id : number) : Promise<Comment[]>;
    getReviews(id : number) : Promise<Review[]>;
}

export default ReviewStrategy;