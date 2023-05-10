import DbService from "@app/database/db";
import { PgErrorMap } from "@app/database/types";
import Conference from "@model/Conference";
import Paper, { PaperStatus } from "@model/Paper";
import Review from "@model/Review";
import { LooseObject } from "@utils/LooseObject";
import { inject, injectable } from "inversify";

@injectable()
export default class PaperRepository{
    constructor(@inject(DbService) private readonly db: DbService) {}
    
    async getPaper(paperId: number) : Promise<Paper> {
        const { rows } = await this.db.query(
            `SELECT *
            FROM paper
            WHERE id = $1`,
            [paperId]
        );
        return rows[0] as Paper;
    }

    async insertPaper(paper : Partial<Paper>){
        const { rows } = await this.db.query(
            `INSERT INTO paper (title, paperstatus, filelocation, coauthors, authorid)
            VALUES ($1, $2, $3, $4, $5) 
            RETURNING *`,
            [paper.title, paper.paperstatus, paper.filelocation, paper.coauthors, paper.authorid]
        ); 
        return rows[0] as Paper;
    }

    async setPaperStatus(paperId: number, status : PaperStatus) {
        const { rows } = await this.db.query(
            `UPDATE paper
            SET status = $2
            WHERE id = $1 
            RETURNING *`,
            [paperId, status]
        );
        return rows[0] as Paper;
    }

    // May be multiple reviewers
    async getAllReviewerFromPaper(paperId: number) {
        const { rows } = await this.db.query(
            `SELECT * 
            FROM reviewer
            LEFT JOIN review ON reviewer.id = review.reviewerid
            WHERE review.paperId=$1`,
            [paperId]
        );
        throw new Error("Method not implemented");
    }

    async getAllocatedPapersForReviewer(reviewerId: number) : Promise<LooseObject[]>{      
        const { rows } = await this.db.query(
            `SELECT *
            FROM review
            LEFT JOIN paper ON paper.id = review.paperId
            WHERE review.reviewerId = $1`, 
            [reviewerId]
        );
        return rows as LooseObject[];
    }

    async isPaperInConference(paperId: number, conferenceId :number): Promise<boolean> {
        const { rows } = await this.db.query(
            `SELECT
            CASE WHEN EXISTS(
                SELECT paperID, conferenceID
                FROM paperconference
                WHERE paperID=$1 AND conferenceID=$2
            )
            THEN true
            ELSE false
            END`, 
            [paperId, conferenceId]
        );
        return rows[0].case;
    }

    // Get all papers an author is in
    async getAllPaperForAuthor(authorId: number): Promise<Paper[]>{
        const { rows } = await this.db.query(
            `SELECT * 
            FROM paper
            WHERE authorid = $1;`,
            [authorId]
        );
        return rows as Paper[];
    }
    
    async getAllPapersInConference(conferenceId : number): Promise<Paper[]>{
        const { rows } = await this.db.query(
            `SELECT paper.*
            FROM paperconference
            LEFT JOIN paper ON paperconference.paperId=paper.id
            WHERE conferenceId=$1;`,
            [conferenceId]
        );
        return rows as Paper[];
    }

    async getConferenceFromPaper(paperId: number): Promise<Conference> {
        const { rows } = await this.db.query(
            `SELECT conference.* 
            FROM paperconference
            LEFT JOIN conference ON paperconference.conferenceid=conference.id
            WHERE paperid=$1`,
            [paperId]
        );
        return rows[0] as Conference;
    }

}
