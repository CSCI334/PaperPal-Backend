import Conference from "../../database/models/Conference.js";

export default class CreateConferenceDTO {
    constructor(
        public readonly conferenceName : string,
        public readonly conferenceLocation : string,
        public readonly submissionDeadline : number,
        public readonly biddingDeadline : number,
        public readonly announcementTime : number,

        public readonly chairEmail : string,
        public readonly chairName : string,
    ) {}

    toConferenceModel(): Partial<Conference> {
        return {
            conferencename : this.conferenceName,
            conferencelocation : this.conferenceLocation,
            submissiondeadline : this.submissionDeadline,
            biddingdeadline : this.biddingDeadline,
            announcementtime : this.announcementTime,
        };
    } 
}