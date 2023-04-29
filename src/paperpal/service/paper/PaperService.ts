
import PaperRepository from "@app/paperpal/repository/PaperRepository";
import ReviewRepository from "@app/paperpal/repository/ReviewRepository";
import { ConferencePhase } from "@app/paperpal/types/ConferencePhase";
import PaperDTO from "@app/paperpal/types/dto/PaperDTO";
import NotAuthenticatedException from "@exception/NotAuthenticatedException";
import NotFoundException from "@exception/NotFoundException";
import { AccountType } from "@model/Account";
import { PaperStatus } from "@model/Paper";
import AccountService from "@service/account/AccountService";
import ConferenceService from "@service/conference/ConferenceService";
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

        @inject(ConferenceService) private readonly conferenceService: ConferenceService,
        @inject(AccountService) private readonly accountService: AccountService,
        @inject(PaperRepository) private readonly paperRepository : PaperRepository,
        @inject(ReviewRepository) private readonly reviewRepository: ReviewRepository) {}
        
    private getStrategy(accountType : AccountType) {
        if(accountType === "ADMIN")
            return this.authorPaperStrategy;
        else if(accountType === "AUTHOR")
            return this.reviewerPaperStrategy;
        else if(accountType === "CHAIR")
            return this.chairPaperStrategy;
        throw new NotAuthenticatedException("Unknown user type");
    }

    async getPaperFileLocation(accountId: number, paperId : number) {
        const user = await this.accountService.getUser(accountId);
        const strategy : PaperStrategy = this.getStrategy(user.accounttype);
        const phase: ConferencePhase = await this.conferenceService.getConferencePhase(user.conferenceid);
        
        return strategy.getPaperFileLocation(user, paperId, phase);
    }

    async getAllPapers(accountId : number) {
        const user = await this.accountService.getUser(accountId);        
        const strategy : PaperStrategy = this.getStrategy(user.accounttype);
        const phase: ConferencePhase = await this.conferenceService.getConferencePhase(user.conferenceid);

        return strategy.getAvailablePapers(user, phase);
    }

    async judgePaper(paperId: number, status : Extract<PaperStatus, "ACCEPTED" | "REJECTED">) {
        const paper = await this.paperRepository.getPaper(paperId);
        if(!paper) throw new NotFoundException("Paper not found"); 
        
        const data = this.paperRepository.setPaperStatus(paperId, status);
        return data;
    }

    async addPaper(paper: PaperDTO, path: string, authorId: number) {
        const data = this.paperRepository.insertPaper({
            paperstatus: "TBD",
            authorid: authorId,
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