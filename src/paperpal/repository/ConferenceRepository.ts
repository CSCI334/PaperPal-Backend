import { inject, injectable } from "inversify";
import DbService from "../../database/db.js";

@injectable()
export default class ConferenceRepository{
    constructor(@inject(DbService) private readonly db: DbService) {}
    
    async insertConference(){
        `INSERT INTO conference(conferenceName,conferenceLocation,submissionDeadline,biddingDeadline,announcementTime)
        VALUES('helo','helo',current_timestamp,current_timestamp,current_timestamp)`;

        return;
    }

    async updateConference() {
        return;
    }
}