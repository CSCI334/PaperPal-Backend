import DbService from "@app/database/db";
import Account from "@model/Account";
import Conference from "@model/Conference";
import { PaperStatus } from "@model/Paper";
import { LooseObject } from "@utils/LooseObject";
import { inject, injectable } from "inversify";

@injectable()
export default class ConferenceRepository{
    constructor(@inject(DbService) private readonly db: DbService) {}
    
    async insertConference(conference : Partial<Conference>){
        const { rows } = await this.db.query(
            `INSERT INTO conference(conferenceName,conferenceLocation,submissionDeadline,biddingDeadline,reviewDeadline,announcementTime)
            VALUES($1, $2, $3, $4, $5, $6)
            RETURNING *`,
            [conference.conferencename, 
                conference.conferencelocation, 
                conference.submissiondeadline, 
                conference.biddingdeadline, 
                conference.reviewdeadline, 
                conference.announcementtime]
        );
        return rows[0] as Conference;
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
                submissionDeadline = COALESCE($2, submissionDeadline),
                biddingDeadline = COALESCE($3, biddingDeadline),
                reviewDeadline = COALESCE($4, reviewDeadline),
                announcementTime = COALESCE($5, announcementTime)
                WHERE id=$1
                RETURNING *`,
            [conference.id, 
                conference.submissiondeadline?.toISOString(), 
                conference.biddingdeadline?.toISOString(), 
                conference.reviewdeadline?.toISOString(), 
                conference.announcementtime?.toISOString()]);
        return rows[0] as Conference;
    }

    async getLastConference() {
        const { rows } = await this.db.query(
            `SELECT * FROM conference
            ORDER BY announcementtime DESC 
            LIMIT 1` 
        );
        
        return rows[0] as Conference;
    }

    async getAllEmailFromConference(conferenceId: number) {
        const { rows } = await this.db.query(
            `SELECT email FROM account
            WHERE conferenceid=$1 AND (accounttype='AUTHOR' OR accounttype='REVIEWER') AND accountstatus='ACCEPTED';`,
            [conferenceId]
        );
        return rows as LooseObject[];
    }

    async getAllAcceptedPaperTitles(conferenceId: number) {
        const { rows } = await this.db.query(
            `SELECT title FROM paperconference
            WHERE conferenceid=$1 AND paperstatus='ACCEPTED';`,
            [conferenceId]
        );
        return rows as LooseObject[];
    }

    async getAllRejectedPaperTitles(conferenceId: number) {
        const { rows } = await this.db.query(
            `SELECT title FROM paperconference
            WHERE conferenceid=$1 AND paperstatus IN ('REJECTED','TBD');`,
            [conferenceId]
        );
        return rows as LooseObject[];
    }
}