import { inject, injectable } from "inversify";
import DbService from "../../database/db.js";
import Paper, { PaperStatus } from "../../database/models/Paper.js";
import Conference from "../../database/models/Conference.js";

@injectable()
export default class PaperRepository{
    constructor(@inject(DbService) private readonly db: DbService) {}
    
    async getPaper(paperId: number) : Promise<Paper> {
        return;
    }

    async insertPaper(paper : Partial<Paper>){
        `INSERT INTO paper ( title, filelocation, authorid, ownerreviewerid)
        VALUES ( title, filelocation, authorid, ownerreviewerid);`;

        return;
    }

    async setPaperStatus(paperId:number, status : PaperStatus) {
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
        return;
    }

    async isPaperInConference(paperId:number, conferenceId : number): Promise<boolean> {
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
        return;
    }

    async getConferenceFromPaper(paperId: number): Promise<Conference> {
        return;
    }

    async getPapersAndBids(conferenceId: number, reviewerId: number) {
        return {};
    }

    async allocatePaperToReviewer(paperId: number, reviewerId: number){
        // Create empty Review column with paperId and reviewerId
        return;
    }
}
