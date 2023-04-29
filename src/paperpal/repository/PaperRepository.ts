import DbService from "@app/database/db";
import Conference from "@model/Conference";
import Paper, { PaperStatus } from "@model/Paper";
import { inject, injectable } from "inversify";

@injectable()
export default class PaperRepository{
    constructor(@inject(DbService) private readonly db: DbService) {}
    
    async getPaper(paperId: number) : Promise<Paper> {
        throw new Error("Method not implemented");

    }

    async insertPaper(paper : Partial<Paper>){
        `INSERT INTO paper ( title, filelocation, authorid, ownerreviewerid)
        VALUES ( title, filelocation, authorid, ownerreviewerid);`;

        throw new Error("Method not implemented");

    }

    async setPaperStatus(paperId:number, status : PaperStatus) {
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
        throw new Error("Method not implemented");

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
        throw new Error("Method not implemented");

    }

    async getConferenceFromPaper(paperId: number): Promise<Conference> {
        throw new Error("Method not implemented");

    }

    async getPapersAndBids(conferenceId: number, reviewerId: number) {
        return {};
    }

    async allocatePaperToReviewer(paperId: number, reviewerId: number){
        // Create empty Review column with paperId and reviewerId
        throw new Error("Method not implemented");
    }
}
