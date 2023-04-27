import { inject, injectable } from "inversify";
import PaperStrategy from "../interfaces/PaperStrategy.js";
import ConferenceService from "../../conference/ConferenceService.js";
import PaperRepository from "../../../repository/PaperRepository.js";
import AccountRepository from "../../../repository/AccountRepository.js";
import NotFoundException from "../../../../exceptions/NotFoundException.js";
import Account from "../../../../database/models/Account.js";

@injectable()
export default class ChairPaperStrategy implements PaperStrategy {
    constructor(
        @inject(AccountRepository) private readonly accountRepository: AccountRepository,
        @inject(ConferenceService) private readonly conferenceService : ConferenceService,
        @inject(PaperRepository) private readonly paperRepository : PaperRepository,
    ) {}
    
    async getAvailablePapers(user: Account) {
        // Always get all papers to be reviewed
        const data = await this.paperRepository.getAllPapersInConference(user.conferenceid);
        return data;
    }

    // A chair can only get papers from a conference that they are a chair in
    async getPaperFile(user: Account, paperId: number) {
        const paper = await this.paperRepository.getPaper(paperId);
        if(!paper) throw new NotFoundException("Paper not found");

        const data = await this.paperRepository.getConferenceFromPaper(paperId);
        return data;
    }
}