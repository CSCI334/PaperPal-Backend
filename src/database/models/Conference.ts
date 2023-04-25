export default class Conference {
    constructor(
        public id: number,
        public conferencename : string,
        public conferencelocation : string,
        public submissiondeadline : number,
        public biddingdeadline : number,
        public announcementtime: number,
    ) {}
}