import { inject, injectable } from "inversify";
import DbService from "../../database/db.js";
import Paper, { PaperStatus } from "../../database/models/Paper.js";
import Conference from "../../database/models/Conference.js";

@injectable()
export default class PaperRepository{
    constructor(@inject(DbService) private readonly db: DbService) {}
    
    async getPaper(paperId: number) : Promise<Paper> {
        `SELECT *
        FROM paper
        WHERE id = paper.id;`
        return;
    }

    async insertPaper(paper : Partial<Paper>){
        `INSERT INTO paper ( title, filelocation, authorid, ownerreviewerid)
        VALUES ( title, filelocation, authorid, ownerreviewerid);`;

        return;
    }

    async setPaperStatus(paperId:number, status : PaperStatus) {
        `UPDATE paper
        SET status = 'status'
        WHERE id = id;`
        return;
    }

    // May be multiple reviewers
    async getAllReviewerFromPaper(paperId: number) {
        `SELECT * 
        FROM reviewer
        LEFT JOIN review ON reviewer.id = review.reviewerid;`;
        return;
    }

    async getAllocatedPapersForReviewer(reviewerId: number) : Promise<Paper[]>{        
        `SELECT paper.title , account.username, review.reviewrating
        FROM paper
        INNER JOIN account ON paper.authorid = account.id
        INNER JOIN review ON account.id = review.reviewerid;`
        return;
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
        END;`
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
        `SELECT * 
        FROM paper
        LEFT JOIN conference ON paper.id = conference.id;`
        return;
    }

    async getConferenceFromPaper(paperId: number): Promise<Conference> {
        `SELECT *
        FROM conference
        LEFT JOIN paper ON conference.id = paper.id;`
        return;
    }

    async getPapersAndBids(conferenceId: number, reviewerId: number) {
        `SELECT paper.*, bids.bidamount
        FROM paper
        INNER JOIN bids ON paper.id = bids.paperid;`
        return {};
    }

    async allocatePaperToReviewer(paperId: number, reviewerId: number){
        // Create empty Review column with paperId and reviewerId
       `INSERT INTO (paperrating, reviewrating)
        VALUES (val1, val2);`
        return;
    }
}
