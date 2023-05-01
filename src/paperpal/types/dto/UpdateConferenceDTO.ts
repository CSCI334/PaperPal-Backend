import CreateConferenceDTO from "@app/paperpal/types/dto/CreateConferenceDTO";
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
            body("submissionDeadline", "submissionDeadline does not exists").exists().isInt(),
            body("biddingDeadline", "biddingDeadline does not exists").exists().isInt(),
            body("reviewDeadline", "reviewDeadline does not exists").exists().isInt(),
            body("announcementTime", "announcementTime does not exists").exists().isInt(),
            ...CreateConferenceDTO.deadlinesHasNotPassedCurrent()
        ];
    };
}