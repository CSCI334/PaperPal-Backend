import { check } from "express-validator";
import { AccountType } from "../../../database/models/Account.js";
import { Rating } from "../Rating.js";
import RatingDTO from "./RatingDTO.js";

export default class PaperRatingDTO extends RatingDTO {
    constructor(
        public readonly rating: Rating,
        public readonly reviewId: number
    ) {
        super(rating, reviewId);
    }

    static validator = [
        ...RatingDTO.validator,
        check("reviewId", "reviewId field does not exist").exists(),
        check("reviewId", "reviewId field is not an integer").isInt(),
    ];
}