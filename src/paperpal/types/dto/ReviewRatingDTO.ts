import RatingDTO from "@app/paperpal/types/dto/RatingDTO";
import { Rating } from "@app/paperpal/types/Rating";
import { body, } from "express-validator";

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