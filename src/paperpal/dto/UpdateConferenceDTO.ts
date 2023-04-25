export default class CreateConferenceDTO {
    constructor(
        public readonly conferenceId : number,
        public readonly submissionDeadline : number,
        public readonly biddingDeadline : number,
        public readonly announcementTime : number,
    ) {}
}