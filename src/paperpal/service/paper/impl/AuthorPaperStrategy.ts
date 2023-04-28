import { inject, injectable } from "inversify";
import PaperStrategy from "../interfaces/PaperStrategy.js";
import PaperRepository from "../../../repository/PaperRepository.js";
import NotAuthenticatedException from "../../../../exceptions/NotAuthenticatedException.js";
import NotFoundException from "../../../../exceptions/NotFoundException.js";
import Account from "../../../../database/models/Account.js";
import AccountRepository from "../../../repository/AccountRepository.js";
import Author from "../../../../database/models/Author.js";

@injectable()
export default class AuthorPaperStrategy implements PaperStrategy {
    constructor(
        @inject(AccountRepository) private readonly accountRepository : AccountRepository,
        @inject(PaperRepository) private readonly paperRepository : PaperRepository,
    ) {}

    // Gets all paper created by the logged in Author
    async getAvailablePapers(user: Account) {
        const author : Author = await this.accountRepository.getAuthor(user.id);
        if(!author) throw new NotAuthenticatedException("User is not an author"); 

        const data = await this.paperRepository.getAllPaperForAuthor(author.id);
        return data;
    }

    // Gets paper file for own's paper, checks if user actually owns paper
    async getPaperFileLocation(user: Account, paperId: number) {
        const paper = await this.paperRepository.getPaper(paperId);
        if(!paper) throw new NotFoundException("Paper not found");

        const author = await this.accountRepository.getAuthor(user.id);
        if(!author) throw new NotAuthenticatedException("User is not an author");
        if(paper.authorid != author.id) throw new NotAuthenticatedException("User is not author of paper");   
        
        return paper.filelocation;
    }
}