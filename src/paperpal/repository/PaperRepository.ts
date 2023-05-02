import DbService from "@app/database/db";
import Conference from "@model/Conference";
import Paper, { PaperStatus } from "@model/Paper";
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
            RETURNING*`,
            [paper.title, paper.paperstatus, paper.filelocation, paper.coauthors, paper.authorid]
        ); 

        return rows[0] as Paper;
    }

    async setPaperStatus(paperId:number, status : PaperStatus) {
        
        `UPDATE paper
        SET status = 'status'
        WHERE id = id;`;
        throw new Error("Method not implemented");
    }

    // May be multiple reviewers
    async getAllReviewerFromPaper(paperId: number) {
        `SELECT * 
        FROM reviewer
        LEFT JOIN review ON reviewer.id = review.reviewerid;`;
        throw new Error("Method not implemented");

    }

        
    async getAllocatedPapersForReviewer(reviewerId: number) : Promise<Paper[]>{      
        
        `SELECT paper.title , account.username, review.reviewrating
        FROM paper
        INNER JOIN account ON paper.authorid = account.id
        INNER JOIN review ON account.id = review.reviewerid;`;
        throw new Error("Method not implemented");
    }

    async isPaperInConference(paperId:number, conferenceId : number): Promise<boolean> {
        `SELECT
        CASE WHEN EXISTS(
            SELECT paper.id
          FROM paper
          INNER JOIN conference ON paper.id = conference.id
        )
        THEN 'TRUE'
        ELSE 'FALSE'
        END;`;
        return true;
    }

    // Get all papers an author is in
    async getAllPaperForAuthor(authorId: number){
        `SELECT * 
        FROM author
        LEFT JOIN paper ON author.id = paper.authorid;`;
        return {};
    }
    
    async getAllPapersInConference(conferenceId : number): Promise<Paper[]>{
        throw new Error("Method not implemented");

    }

    async getConferenceFromPaper(paperId: number): Promise<Conference> {
        `SELECT * 
        FROM paper
        LEFT JOIN conference ON paper.id = conference.id;`;
        throw new Error("Method not implemented");
    }


    async getPapersAndBids(conferenceId: number, reviewerId: number) {
        `SELECT paper.*, bids.bidamount
        FROM paper
        INNER JOIN bids ON paper.id = bids.paperid;`;
        return {};
    }

    async allocatePaperToReviewer(paperId: number, reviewerId: number){
        // Create empty Review column with paperId and reviewerId
        `INSERT INTO (paperrating, reviewrating)
        VALUES (val1, val2);`;
        throw new Error("Method not implemented");
    }
}
