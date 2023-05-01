import { body, } from "express-validator";

export default class PaperDTO {
    // Coauthors should be a string delimited by comma
    constructor(
        public readonly title: string, 
        public readonly coauthors: string
    ) {}

    static validator = () => {
        return [
            body("title", "Title field does not exist").exists().escape(),
            body("coauthors", "Coauthor field does not exist").exists(),
        ];
    };

    
    static paperStatusValidator = () =>{
        return [
            body("paperStatus", "paperStatus does not exist").exists(),
            body("paperStatus", "paperStatus is not ACCEPTED or REJECTED").isIn(
                ["ACCEPTED", "REJECTED"]
            ),
        ];
    };
}
