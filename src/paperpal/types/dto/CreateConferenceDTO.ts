import Conference from "@model/Conference";
import { epochToDate } from "@utils/utils";
import { body } from "express-validator";

// All deadlines should be in unix time and in seconds.
export default class CreateConferenceDTO {
    constructor(
        public readonly conferenceName : string,
        public readonly conferenceLocation : string,
        
        public readonly submissionDeadline : number,
        public readonly biddingDeadline : number,
        public readonly reviewDeadline : number,
        public readonly announcementTime : number,
        
        public readonly chairEmail : string,
        public readonly chairName : string,
    ) {}
        
    static toConferenceModel(DTO: CreateConferenceDTO): Partial<Conference> {
        return {
            conferencename : DTO.conferenceName,
            conferencelocation : DTO.conferenceLocation,
            submissiondeadline : epochToDate(DTO.submissionDeadline),
            biddingdeadline : epochToDate(DTO.biddingDeadline),
            reviewdeadline: epochToDate(DTO.reviewDeadline),
            announcementtime : epochToDate(DTO.announcementTime),
        };
    } 

    static validator = () => {
        return [
            body("conferenceName", "conferenceName does not exists").exists().escape(),
            body("conferenceLocation", "conferenceLocation does not exists").exists().escape(),
            body("submissionDeadline", "submissionDeadline does not exists").exists(),
            body("submissionDeadline", "submissionDeadline is not an epoch number").isNumeric(),
            body("reviewDeadline", "reviewDeadline does not exists").exists(),
            body("reviewDeadline", "reviewDeadline is not an epoch number").isNumeric(),
            body("biddingDeadline", "biddingDeadline does not exists").exists(),
            body("biddingDeadline", "biddingDeadline is not an epoch number").isNumeric(),
            body("announcementTime", "announcementTime does not exists").exists(),
            body("announcementTime", "announcementTime is not an epoch number").isNumeric(),
            body("chairEmail", "chairEmail does not exists").exists().normalizeEmail(),
            body("chairName", "chairName does not exists").exists().escape(),
            ...this.deadlinesHasNotPassedCurrent(),
        ];
    };

    static deadlinesHasNotPassedCurrent = () => {
        const current = Math.round(Date.now()) / 1000;
        return [
            CreateConferenceDTO.hasPassedEpochValidator("submissionDeadline", current),   
            CreateConferenceDTO.hasPassedEpochValidator("biddingDeadline", current),   
            CreateConferenceDTO.hasPassedEpochValidator("reviewDeadline", current),   
            CreateConferenceDTO.hasPassedEpochValidator("announcementTime", current),   
        ];
    };

    // Checks if date has passed a certain epoch
    static hasPassedEpochValidator = (deadlineName : string, epoch: number) => {
        return body(deadlineName, deadlineName + " has already passed").custom((deadline) => {
            const targetDate = new Date(epoch);
            const deadlineDate = new Date(deadline);
            return targetDate < deadlineDate;
        });
    };
}