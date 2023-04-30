interface Conference {
    id: number;
    conferencename : string;
    conferencelocation : string;
    submissiondeadline : Date;
    biddingdeadline : Date;
    reviewdeadline : Date;
    judgmentdeadline : Date;
    announcementtime: Date;
}
export default Conference;