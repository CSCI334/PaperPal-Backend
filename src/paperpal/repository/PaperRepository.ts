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

    async deletePaper(){
        `DELETE FROM paper
        WHERE colData = valData;`
        return;
    }

    async setPaperStatus(status : PaperStatus) {
        `UPDATE review
        SET col1 = val1, col2 =val2
        WHERE colData = valData;`
        return;
    }

    // May be multiple reviewers
    async getAllReviewerFromPaper(paperId: number) {
        `SELECT * 
        FROM reviewer
        LEFT JOIN paper ON reviewer.id = paper.ownerreviewerid;`
        return;
    }

    async getAllocatedPaperForReviewer(reviewerId: number) : Promise<Paper[]>{
        return;
    }

    // May be multiple authors
    async getAllAuthorFromPaper() {
        return;
    }

    // Get all papers an author is in
    async getAllPaperForAuthor(accountId: number){
        `SELECT * 
        FROM author
        LEFT JOIN paper ON author.id = paper.authorid;`
        return {};
    }
    
    
    async getAllPapersInConference(conferenceId : number): Promise<Paper[]>{
        return;
    }

    async getConferenceFromPaper(paperId: number): Promise<Conference> {
        return;
    }

    async getPapersAndBids(conferenceId: number, accountId: number) {
        return {};
    }

    async getPaperForReviewer(){
        return;
    }

    async getPaperFileLocation(){
        return;
    }
    
    async setPaperReviewer(){
        return;
    }

    
    async allocatePaperToReviewer(paperId: number, reviewerId: number){
        return;
    }
}
