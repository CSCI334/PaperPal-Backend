
import ConferenceRepository from "@app/paperpal/repository/ConferenceRepository";
import { ConferencePhase } from "@app/paperpal/types/ConferencePhase";
import CreateConferenceDTO from "@app/paperpal/types/dto/CreateConferenceDTO";
import InviteDTO from "@app/paperpal/types/dto/InviteDTO";
import UpdateConferenceDTO from "@app/paperpal/types/dto/UpdateConferenceDTO";
import InvalidInputException from "@exception/InvalidInputException";
import AccountService from "@service/account/AccountService";
import ConferenceUtils from "@service/conference/ConferenceUtils";
import { epochToDate } from "@utils/utils";
import { inject, injectable } from "inversify";

@injectable()
export default class ConferenceService {
    //var submissionTimer;
    //var biddingTimer;
    //var reviewTimer;
    //var judgementTimer;
    //var announcementTimer;

    constructor(
        @inject(ConferenceRepository) private readonly conferenceRepository: ConferenceRepository,
        @inject(AccountService) private readonly accountService : AccountService) {}
        
    async updateConference(conferenceDTO: UpdateConferenceDTO) {
        const deadlines = [
            conferenceDTO.submissionDeadline , 
            conferenceDTO.biddingDeadline, 
            conferenceDTO.reviewDeadline, 
            conferenceDTO.announcementTime];
        
        if(!ConferenceUtils.deadlinesAreInOrder(deadlines)) throw new InvalidInputException("Conference key dates is not valid");
        
        const data = await this.conferenceRepository.updateConference({
            id: conferenceDTO.conferenceId,
            submissiondeadline: epochToDate(conferenceDTO.submissionDeadline),
            biddingdeadline: epochToDate(conferenceDTO.biddingDeadline),
            reviewdeadline: epochToDate(conferenceDTO.reviewDeadline),
            announcementtime: epochToDate(conferenceDTO.announcementTime),
        });
        return data;
    }
    
    async createConference(conferenceDTO : CreateConferenceDTO) {
        const lastConference = await this.conferenceRepository.getLastConference();

        const deadlines = [
            conferenceDTO.submissionDeadline , 
            conferenceDTO.biddingDeadline, 
            conferenceDTO.reviewDeadline, 
            conferenceDTO.announcementTime];
        
        if(!ConferenceUtils.deadlinesAreInOrder(deadlines)) 
            throw new InvalidInputException("Conference key dates are not valid");
        if(lastConference && ConferenceUtils.getConferencePhase(lastConference) < ConferencePhase.Announcement) 
            throw new InvalidInputException("There is still an ongoing conference");
        await this.conferenceRepository.insertConference(CreateConferenceDTO.toConferenceModel(conferenceDTO));
        const data = await this.accountService.register(new InviteDTO(conferenceDTO.chairEmail, conferenceDTO.chairName, "CHAIR"));
        return data;
    }

    async startSubmissionPhase(conferenceDTO: UpdateConferenceDTO){
        console.log("STARTING THE SUBMISSION PHASE");
        submissionTimer = setTimeout(() => this.endSubmissionPhase(conferenceDTO), (conferenceDTO.submissionDeadline * 1000));
        return 0;
    }
    
    async endSubmissionPhase(conferenceDTO: UpdateConferenceDTO){
        console.log("ENDING THE SUBMISSION PHASE");
        this.startBiddingPhase(conferenceDTO);
        return 0;
    }

    async updateSubmissionPhase(conferenceDTO: UpdateConferenceDTO){
        clearTimeout(submissionTimer);
        submissionTimer = setTimeout(() => this.endSubmissionPhase(conferenceDTO), (conferenceDTO.submissionDeadline * 1000));
    }

    async startBiddingPhase(conferenceDTO: UpdateConferenceDTO){
        console.log("STARTING THE BIDDING PHASE");
        biddingTimer = setTimeout(() => this.endBiddingPhase(conferenceDTO), (conferenceDTO.biddingDeadline * 1000));
        return 0;
    }
    
    async endBiddingPhase(conferenceDTO: UpdateConferenceDTO){
        console.log("ENDING THE BIDDING PHASE");
        this.startReviewPhase(conferenceDTO);
        return 0;
    }

    async updateBiddingPhase(conferenceDTO: UpdateConferenceDTO){
        clearTimeout(biddingTimer);
        biddingTimer = setTimeout(() => this.endBiddingPhase(conferenceDTO), (conferenceDTO.biddingDeadline * 1000));
    }

    async startReviewPhase(conferenceDTO: UpdateConferenceDTO){
        console.log("STARTING THE REVIEW PHASE");
        reviewTimer = setTimeout(() => this.endReviewPhase(conferenceDTO), (conferenceDTO.reviewDeadline * 1000));
        return 0;
    }
    
    async endReviewPhase(conferenceDTO: UpdateConferenceDTO){
        console.log("ENDING THE REVIEW PHASE");
        this.startJudgementPhase(conferenceDTO);
        return 0;
    }

    async updateReviewPhase(conferenceDTO: UpdateConferenceDTO){
        clearTimeout(reviewTimer);
        reviewTimer = setTimeout(() => this.endReviewPhase(conferenceDTO), (conferenceDTO.reviewDeadline * 1000));
    }

    async startJudgementPhase(conferenceDTO: UpdateConferenceDTO){
        console.log("STARTING THE JUDGEMENT PHASE");
        //TESTING
        var time = 5;
        judgementTimer = setTimeout(() => this.endJudgementPhase(conferenceDTO), (time * 1000));
        return 0;
    }
    
    async endJudgementPhase(conferenceDTO: UpdateConferenceDTO){
        console.log("ENDING THE JUDGEMENT PHASE");
        this.startAnnouncementPhase(conferenceDTO);
        return 0;
    }

    async updateJudgementPhase(conferenceDTO: UpdateConferenceDTO){
        clearTimeout(judgementTimer);
        //TESTING
        var time = 5;
        judgementTimer = setTimeout(() => this.endJudgementPhase(conferenceDTO), (time * 1000));
    }

    async startAnnouncementPhase(conferenceDTO: UpdateConferenceDTO){
        console.log("STARTING THE ANNOUNCEMENT PHASE");
        announcementTimer = setTimeout(() => this.endAnnouncementPhase(), (conferenceDTO.announcementTime * 1000));
        return 0;
    }
    
    async endAnnouncementPhase(){
        console.log("ENDING THE ANNOUNCEMENT PHASE");
        return 0;
    }

    async updateAnnouncementPhase(conferenceDTO: UpdateConferenceDTO){
        clearTimeout(announcementTimer);
        announcementTimer = setTimeout(() => this.endAnnouncementPhase(), (conferenceDTO.announcementTime * 1000));
    }
}