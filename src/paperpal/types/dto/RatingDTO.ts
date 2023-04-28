import { body, } from "express-validator";
import { Rating } from "../Rating.js";

export default abstract class RatingDTO {
    constructor(
        public readonly rating: Rating,
        public readonly id: number
    ) {}

    static validator = () => {
        return [
            body("rating", "Rating field does not exist").exists(),
            body("rating", "Rating field is not an integer").isInt(),
            body("rating", "Rating field is invalid. Value can only be from -3 to 3").isIn([
                -3, -2, -1, 0, 1, 2, 3 
            ]),
        ];
    };
}