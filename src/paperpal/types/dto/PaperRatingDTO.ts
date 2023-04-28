import { body, } from "express-validator";
import { Rating } from "../Rating.js";
import RatingDTO from "./RatingDTO.js";

export default class PaperRatingDTO extends RatingDTO {
    constructor(
        public readonly rating: Rating,
        public readonly paperId: number
    ) {
        super(rating, paperId);
    }

    static validator = () => {
        return [
            ...RatingDTO.validator(),
            body("paperId", "PaperId field does not exist").exists(),
            body("paperId", "PaperId field is not an integer").isInt(),
        ];
    };
}