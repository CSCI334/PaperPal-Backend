import { check } from "express-validator";

export default class BidDTO {
    constructor(
        public readonly paperId: number, 
        public readonly bidAmount: number
    ) {}
    static validator = [
        check("paperId", "paperId field does not exist").exists(),
        check("bidAmount", "bidAmount field does not exist").optional(),
    ];
}
