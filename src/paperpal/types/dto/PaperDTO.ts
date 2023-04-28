import { check } from "express-validator";

export default class PaperDTO {
    constructor(
        public readonly title: string, 
        public readonly coauthors: string[]
    ) {}
    static validator = [
        check("title", "Title field does not exist").exists(),
        check("coauthor").optional(),
    ];
}
