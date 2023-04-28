import { body } from "express-validator";

export default abstract class CommentDTO {
    constructor(
        public readonly paperId: number,
        public readonly comment: string
    ) {}

    static validator = () => {
        return [
            body("comment", "Comment field does not exist").exists(),
            body("comment", "Comment field is not a string").isString().escape(),
            body("paperId", "paperId field does not exist").exists(),
            body("paperId", "paperId field is not an integer").isInt(),
        ];
    }; 
}