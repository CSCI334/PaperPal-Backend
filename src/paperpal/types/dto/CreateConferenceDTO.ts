import { ValidationChain, body } from "express-validator";
import Conference from "../../../database/models/Conference.js";

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
            submissiondeadline : DTO.submissionDeadline,
            biddingdeadline : DTO.biddingDeadline,
            reviewDeadline: DTO.reviewDeadline,
            announcementtime : DTO.announcementTime,
        };
    } 

    static validator: ValidationChain[] = [
        body("conferenceName", "conferenceName does not exists").exists(),
        body("conferenceLocation", "conferenceLocation does not exists").exists(),
        body("submissionDeadline", "submissionDeadline does not exists").exists(),
        body("submissionDeadline", "submissionDeadline is not an epoch number").isNumeric(),
        body("biddingDeadline", "biddingDeadline does not exists").exists(),
        body("biddingDeadline", "biddingDeadline is not an epoch number").isNumeric(),
        body("announcementTime", "announcementTime does not exists").exists(),
        body("announcementTime", "announcementTime is not an epoch number").isNumeric(),
        body("chairEmail", "chairEmail does not exists").exists(),
        body("chairName", "chairName does not exists").exists(),
    ];
}