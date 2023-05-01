import { body, } from "express-validator";

export default class PaperDTO {
    constructor(
        public readonly title: string, 
        public readonly coauthor: string[]
    ) {}

    static validator = () => {
        return [
            body("title", "Title field does not exist").exists().escape(),
            body("coauthor", "Coauthor field does not exist").exists(),
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
