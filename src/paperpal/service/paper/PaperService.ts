
import PaperRepository from "@app/paperpal/repository/PaperRepository";
import { ConferencePhase } from "@app/paperpal/types/ConferencePhase";
import { TokenData } from "@app/paperpal/types/TokenData";
import PaperDTO from "@app/paperpal/types/dto/PaperDTO";
import InvalidInputException from "@exception/InvalidInputException";
import NotAuthenticatedException from "@exception/NotAuthenticatedException";
import NotFoundException from "@exception/NotFoundException";
import { AccountType } from "@model/Account";
import { PaperStatus } from "@model/Paper";
import AccountRepository from "@repository/AccountRepository";
import ConferenceRepository from "@repository/ConferenceRepository";
import AccountService from "@service/account/AccountService";
import ConferenceUtils from "@service/conference/ConferenceUtils";
import AuthorPaperStrategy from "@service/paper/impl/AuthorPaperStrategy";
import ChairPaperStrategy from "@service/paper/impl/ChairPaperStrategy";
import ReviewerPaperStrategy from "@service/paper/impl/ReviewerPaperStrategy";
import PaperStrategy from "@service/paper/interfaces/PaperStrategy";
import { injectable, inject } from "inversify";

@injectable()
export default class PaperService {
    constructor(
        @inject(AuthorPaperStrategy) private readonly authorPaperStrategy : AuthorPaperStrategy,
        @inject(ReviewerPaperStrategy) private readonly reviewerPaperStrategy : ReviewerPaperStrategy,
        @inject(ChairPaperStrategy) private readonly chairPaperStrategy : ChairPaperStrategy,

        @inject(AccountService) private readonly accountService: AccountService,
        @inject(AccountRepository) private readonly accountRepository: AccountRepository,
        @inject(PaperRepository) private readonly paperRepository : PaperRepository,
        @inject(ConferenceRepository) private readonly conferenceRepository: ConferenceRepository,
    ) {}
        
    private getStrategy(accountType : AccountType) {
        if(accountType === "AUTHOR")
            return this.authorPaperStrategy;
        else if(accountType === "REVIEWER")
            return this.reviewerPaperStrategy;
        else if(accountType === "CHAIR")
            return this.chairPaperStrategy;
        throw new NotAuthenticatedException("Unknown user type");
    }

    async getPaperFileLocation(accountId: number, paperId : number) {
        const user = await this.accountService.getUser(accountId);
        const strategy : PaperStrategy = this.getStrategy(user.accounttype);
        const lastConference = await this.conferenceRepository.getLastConference();

        const phase: ConferencePhase = await ConferenceUtils.getConferencePhase(lastConference);
        
        return strategy.getPaperFileLocation(user, paperId, phase);
    }

    async getAllPapers(accountId : number) {
        const user = await this.accountService.getUser(accountId);        
        const strategy : PaperStrategy = this.getStrategy(user.accounttype);
        const lastConference = await this.conferenceRepository.getLastConference();

        const phase: ConferencePhase = await ConferenceUtils.getConferencePhase(lastConference);

        return strategy.getAvailablePapers(user, phase);
    }

    async judgePaper(paperId: number, conferenceId: number, status : Extract<PaperStatus, "ACCEPTED" | "REJECTED">) {
        const paper = await this.paperRepository.getPaper(paperId);
        if(!paper) throw new NotFoundException("Paper not found"); 
        
        const data = this.paperRepository.setPaperStatus(paperId, status);
        return data;
    }

    async addPaper(paper: PaperDTO, path: string | undefined, token : TokenData) {
        const author = await this.accountRepository.getAuthor(token.accountId);
        if(!author) throw new NotFoundException("Author not found");
        if(path === undefined) throw new InvalidInputException("Could not upload file");
        const data = await this.paperRepository.insertPaper({
            paperstatus: "TBD",
            authorid: author.id,
            filelocation: path,
            coauthors: paper.coauthors,
            title: paper.title,
        });
        return data;
    }

    async allocatePaperToReviewer(paperId: number, reviewerId: number) {
        const data = this.paperRepository.allocatePaperToReviewer(paperId, reviewerId);
        return data;
    }
}