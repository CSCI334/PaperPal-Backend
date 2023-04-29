import RatingDTO from "@app/paperpal/types/dto/RatingDTO";
import { Rating } from "@app/paperpal/types/Rating";
import { body, } from "express-validator";

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