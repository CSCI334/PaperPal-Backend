import { ValidationChain, body } from "express-validator";

export default class UpdateConferenceDTO {
    constructor(
        public readonly conferenceId : number,
        public readonly submissionDeadline : number,
        public readonly biddingDeadline : number,
        public readonly reviewDeadline : number,
        public readonly announcementTime : number,
    ) {}

    static validator: ValidationChain[] = [
        body("conferenceId", "conferenceId does not exists").exists(),
        body("submissionDeadline", "submissionDeadline is not an epoch number").optional({nullable:true}).isNumeric(),
        body("biddingDeadline", "biddingDeadline is not an epoch number").optional({nullable:true}).isNumeric(),
        body("reviewDeadline", "reviewDeadline is not an epoch number").optional({nullable:true}).isNumeric(),
        body("announcementTime", "announcementTime does not exists").optional({nullable:true}).isNumeric(),
    ];
}