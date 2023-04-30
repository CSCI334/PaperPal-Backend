import { body } from "express-validator";

// All deadlines should be in unix time and in seconds.
export default class UpdateConferenceDTO {
    constructor(
        public readonly conferenceId : number,
        public readonly submissionDeadline : number,
        public readonly biddingDeadline : number,
        public readonly reviewDeadline : number,
        public readonly announcementTime : number,
    ) {}

    static validator = () => { 
        return [
            body("conferenceId", "conferenceId does not exists").exists(),
            body("submissionDeadline", "submissionDeadline is not an epoch number").optional({nullable:true}).isInt(),
            body("biddingDeadline", "biddingDeadline is not an epoch number").optional({nullable:true}).isInt(),
            body("reviewDeadline", "reviewDeadline is not an epoch number").optional({nullable:true}).isInt(),
            body("announcementTime", "announcementTime does not exists").optional({nullable:true}).isInt(),
        ];
    };
}