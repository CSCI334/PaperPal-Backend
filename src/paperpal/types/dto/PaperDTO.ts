import { check } from "express-validator";

export default class PaperDTO {
    constructor(
        public readonly title: string, 
        public readonly coauthors: string[]
    ) {}
    static validator = [
        check("title", "Title field does not exist").exists(),
        check("coauthor").optional({nullable:true}),
    ];

    static paperStatusValidator = [
        check("paperStatus", "paperStatus does not exist").exists(),
        check("paperStatus", "paperStatus is not ACCEPTED or REJECTED").isIn(
            ["ACCEPTED", "REJECTED"]
        ),
    ];
}
