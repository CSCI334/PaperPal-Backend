import DbService from "@app/database/db";
import Conference from "@model/Conference";
import { inject, injectable } from "inversify";


@injectable()
export default class ConferenceRepository{
    constructor(@inject(DbService) private readonly db: DbService) {}
    
    async insertConference(conference : Partial<Conference>){
        const { rows } = await this.db.query(
            `INSERT INTO conference(conferenceName,conferenceLocation,submissionDeadline,biddingDeadline, reviewDeadline,announcementTime)
            VALUES($1, $2, $3, $4, $5, $6)
            RETURNING ID`,
            [conference.conferencename, conference.conferencelocation, conference.submissiondeadline, conference.biddingdeadline, conference.reviewDeadline, conference.announcementtime]
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
        const { rows } = await this.db.query(
            `UPDATE conference SET 
                submissionDeadline = COALESCE($2, submissionDeadline)
                biddingDeadline = COALESCE($3, biddingDeadline)
                reviewDeadline = COALESCE($4, reviewDeadline)
                announcementTime = COALESCE($5, announcementTime)
                WHERE id = $1`,
            [conference.id, conference.submissiondeadline, conference.biddingdeadline, conference.reviewDeadline, conference.announcementtime]);
        return rows[0].id;
    }
}