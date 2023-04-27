import { inject, injectable } from "inversify";
import PaperStrategy from "../interfaces/PaperStrategy.js";
import ConferenceService from "../../conference/ConferenceService.js";
import PaperRepository from "../../../repository/PaperRepository.js";
import NotAuthenticatedException from "../../../../exceptions/NotAuthenticatedException.js";
import NotFoundException from "../../../../exceptions/NotFoundException.js";
import Account from "../../../../database/models/Account.js";

@injectable()
export default class AuthorPaperStrategy implements PaperStrategy {
    constructor(
        @inject(ConferenceService) private readonly conferenceService : ConferenceService,
        @inject(PaperRepository) private readonly paperRepository : PaperRepository,
    ) {}

    async getAvailablePapers(user: Account) {
        const data = await this.paperRepository.getAllPaperForAuthor(user.id);
        return data;
    }

    async getPaperFile(user: Account, paperId: number) {
        // Check if author is authenticated to get this paper
        const data = await this.paperRepository.getPaper(paperId);
        if(!data) throw new NotFoundException("Paper not found");
        if(data.authorId != user.id) throw new NotAuthenticatedException("User is not author of paper");   
        
        return data;
    }
}