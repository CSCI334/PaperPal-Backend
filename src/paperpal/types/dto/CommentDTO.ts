import { check } from "express-validator";

export default abstract class CommentDTO {
    constructor(
        public readonly paperId: number,
        public readonly comment: string
    ) {}

    static validator = [
        check("comment", "Comment field does not exist").exists(),
        check("comment", "Comment field is not a string").isString(),
        check("paperId", "paperId field does not exist").exists(),
        check("paperId", "paperId field is not an integer").isInt(),
    ];
}