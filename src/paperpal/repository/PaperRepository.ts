import { inject, injectable } from "inversify";
import DbService from "../../database/db.js";
import Paper, { PaperStatus } from "../../database/models/Paper.js";

@injectable()
export default class PaperRepository{
    constructor(@inject(DbService) private readonly db: DbService) {}
    
    async insertPaper(paper : Partial<Paper>){
        return;
    }

    async deletePaper(){
        return;
    }

    async setPaperStatus(status : PaperStatus) {
        return;
    }

    // May be multiple reviewers
    async getAllReviewerFromPaper() {
        return;
    }

    // May be multiple authors
    async getAllAuthorFromPaper() {
        return;
    }

    // Get all papers an author is in
    async getAllPaperForAuthor(){
        return;
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
}