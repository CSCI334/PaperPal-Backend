import { inject, injectable } from "inversify";
import PaperStrategy from "../interfaces/PaperStrategy.js";
import ConferenceService from "../../conference/ConferenceService.js";
import PaperRepository from "../../../repository/PaperRepository.js";
import NotAuthenticatedException from "../../../../exceptions/NotAuthenticatedException.js";
import NotFoundException from "../../../../exceptions/NotFoundException.js";
import Account from "../../../../database/models/Account.js";
import AccountRepository from "../../../repository/AccountRepository.js";

@injectable()
export default class AuthorPaperStrategy implements PaperStrategy {
    constructor(
        @inject(AccountRepository) private readonly accountRepository : AccountRepository,
        @inject(ConferenceService) private readonly conferenceService : ConferenceService,
        @inject(PaperRepository) private readonly paperRepository : PaperRepository,
    ) {}

    // Gets all paper created by the logged in Author
    async getAvailablePapers(user: Account) {
        const authorId = await this.accountRepository.getAuthorIdFromAccount(user.id);
        if(!authorId) throw new NotAuthenticatedException("User is not an author"); 

        const data = await this.paperRepository.getAllPaperForAuthor(authorId);
        return data;
    }

    // Gets paper file for own's paper, checks if user actually owns paper
    async getPaperFile(user: Account, paperId: number) {
        const data = await this.paperRepository.getPaper(paperId);
        if(!data) throw new NotFoundException("Paper not found");

        const authorId = await this.accountRepository.getAuthorIdFromAccount(user.id);
        if(!authorId) throw new NotAuthenticatedException("User is not an author");
        if(data.authorid != authorId) throw new NotAuthenticatedException("User is not author of paper");   
        
        return data;
    }
}