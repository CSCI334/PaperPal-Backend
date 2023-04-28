import { injectable, inject } from "inversify";
import PaperRepository from "../../repository/PaperRepository.js";
import AuthorPaperStrategy from "./impl/AuthorPaperStrategy.js";
import ChairPaperStrategy from "./impl/ChairPaperStrategy.js";
import ReviewerPaperStrategy from "./impl/ReviewerPaperStrategy.js";
import { AccountType } from "../../../database/models/Account.js";
import PaperStrategy from "./interfaces/PaperStrategy.js";
import { PaperStatus } from "../../../database/models/Paper.js";
import { ConferencePhase } from "../../types/ConferencePhase.js";
import ConferenceService from "../conference/ConferenceService.js";
import AccountService from "../account/AccountService.js";
import ReviewRepository from "../../repository/ReviewRepository.js";
import PaperDTO from "../../types/dto/PaperDTO.js";
import NotFoundException from "../../../exceptions/NotFoundException.js";

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
    }

    async getPaper(accountId: number, paperId : number) {
        const user = await this.accountService.getUser(accountId);
        const strategy : PaperStrategy = this.getStrategy(user.accounttype);
        const phase: ConferencePhase = await this.conferenceService.getConferencePhase(user.conferenceid);
        
        return strategy.getPaperFile(user, paperId, phase);
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

    async addPaper(paper: PaperDTO, authorId: number) {
        const data = this.paperRepository.insertPaper({
            paperstatus: "IN REVIEW",
            authorid: authorId,
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