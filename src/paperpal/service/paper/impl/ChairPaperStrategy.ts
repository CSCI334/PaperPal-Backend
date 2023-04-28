import { inject, injectable } from "inversify";
import PaperStrategy from "../interfaces/PaperStrategy.js";
import PaperRepository from "../../../repository/PaperRepository.js";
import NotFoundException from "../../../../exceptions/NotFoundException.js";
import Account from "../../../../database/models/Account.js";
import NotAuthenticatedException from "../../../../exceptions/NotAuthenticatedException.js";

@injectable()
export default class ChairPaperStrategy implements PaperStrategy {
    constructor(
        @inject(PaperRepository) private readonly paperRepository : PaperRepository,
    ) {}
    
    // Always get all papers to be accepted/rejected 
    async getAvailablePapers(user: Account) {
        const data = await this.paperRepository.getAllPapersInConference(user.conferenceid);
        return data;
    }

    // A chair can only get papers from a conference that they are a chair in
    async getPaperFileLocation(user: Account, paperId: number) {
        const paper = await this.paperRepository.getPaper(paperId);
        if(!paper) throw new NotFoundException("Paper not found");

        const data = await this.paperRepository.getConferenceFromPaper(paperId);
        if(!(data.id === user.conferenceid)) throw new NotAuthenticatedException("Paper does not belong to this account's conference");
        return paper.filelocation;
    }
}