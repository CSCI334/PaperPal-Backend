import { check } from "express-validator";

export default class WorkloadDTO {
    constructor(
        public readonly amountOfPapers: number
    ) {}
    static validator = [
        check("amountOfPapers", "amountOfPapers field does not exist").exists(),
    ];
}
