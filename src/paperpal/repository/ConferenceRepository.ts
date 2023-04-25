import { inject, injectable } from "inversify";
import DbService from "../../database/db.js";
import Conference from "../../database/models/Conference.js";
import CreateConferenceDTO from "../dto/CreateConferenceDTO.js";

@injectable()
export default class ConferenceRepository{
    constructor(@inject(DbService) private readonly db: DbService) {}
    
    async insertConference(conference : Partial<Conference>){
        const { rows } = await this.db.query(
            `INSERT INTO conference(conferenceName,conferenceLocation,submissionDeadline,biddingDeadline,announcementTime)
            VALUES('helo','helo',current_timestamp,current_timestamp,current_timestamp)
            RETURNING ID`,
            []
        );
        return rows[0].id as number;
    }
        
    async getConference(conferenceId: number) {
        const { rows } = await this.db.query(
            `SELECT * FROM conference WHERE id = $1`,
            [conferenceId]
        );
        return rows[0] as Conference;
    }
    async updateConference(conference : Partial<Conference>) {
        return;
    }
}