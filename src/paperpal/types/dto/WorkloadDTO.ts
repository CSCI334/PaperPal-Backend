import { body } from "express-validator";

export default class WorkloadDTO {
    constructor(
        public readonly amountOfPapers: number
    ) {}
    static validator = () => {
        return [
            body("amountOfPapers", "amountOfPapers field does not exist").exists(),
        ];
    }; 
}
