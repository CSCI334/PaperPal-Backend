import { body, } from "express-validator";
import { Rating } from "../Rating.js";
import RatingDTO from "./RatingDTO.js";

export default class PaperRatingDTO extends RatingDTO {
    constructor(
        public readonly rating: Rating,
        public readonly reviewId: number
    ) {
        super(rating, reviewId);
    }
    static validator = () => {
        return [
            ...RatingDTO.validator(),
            body("reviewId", "reviewId field does not exist").exists(),
            body("reviewId", "reviewId field is not an integer").isInt(),
        ];
    };
}