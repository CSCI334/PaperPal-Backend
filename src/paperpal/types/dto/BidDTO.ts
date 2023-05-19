import { body, } from "express-validator";

export default class BidDTO {
    constructor(
        public readonly paperId: number, 
        public readonly bidAmount: number
    ) {}

    static validator = () => {
        return [
            body("paperId", "paperId field does not exist").exists(),
            body("bidAmount", "bidAmount field does not exist").exists(),
            body("bidAmount", "bidAmount field has to be larger than 0").isInt({ min: 1 }),
        ];
    };
}
