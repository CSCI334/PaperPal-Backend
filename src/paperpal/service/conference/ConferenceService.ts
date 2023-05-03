
import ConferenceRepository from "@app/paperpal/repository/ConferenceRepository";
import { ConferencePhase } from "@app/paperpal/types/ConferencePhase";
import CreateConferenceDTO from "@app/paperpal/types/dto/CreateConferenceDTO";
import InviteDTO from "@app/paperpal/types/dto/InviteDTO";
import UpdateConferenceDTO from "@app/paperpal/types/dto/UpdateConferenceDTO";
import InvalidInputException from "@exception/InvalidInputException";
import Conference from "@model/Conference";
import AccountService from "@service/account/AccountService";
import ConferenceUtils from "@service/conference/ConferenceUtils";
import { epochToDate } from "@utils/utils";
import { inject, injectable } from "inversify";
import timerMap from "@service/conference/PhaseService";
@injectable()
export default class ConferenceService {
    constructor(
        @inject(ConferenceRepository) private readonly conferenceRepository: ConferenceRepository,
        @inject(AccountService) private readonly accountService : AccountService) {}
        
    async updateConference(conferenceDTO: UpdateConferenceDTO) {
        const deadlines = [
            conferenceDTO.submissionDeadline, 
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

    async startSubmissionPhase(){
        // submissionTimer
        // biddingTimer
        // reviewTimer
        // judgementTimer
        // announcementTimer
        const conference =  await this.conferenceRepository.getLastConference();
        
        console.log("STARTING THE SUBMISSION PHASE");
        const submissionTimer = setTimeout(() => 
            this.endSubmissionPhase(conference), ((conference.submissiondeadline.getTime() - Date.now()) * 1000)
        );
        return 0;
    }
    
    async endSubmissionPhase(conference: Conference){
        console.log("ENDING THE SUBMISSION PHASE");
        this.startBiddingPhase(conference);
        return 0;
    }

    async updateSubmissionPhase(conference: Conference){
        clearTimeout(timerMap[whatever]);
        const submissionTimer = setTimeout(() => this.endSubmissionPhase(conference), (conference.submissionDeadline * 1000));
    }

    async startBiddingPhase(conference: Conference){
        console.log("STARTING THE BIDDING PHASE");
        biddingTimer = setTimeout(() => this.endBiddingPhase(conference), (conference.biddingDeadline * 1000));
        return 0;
    }
    
    async endBiddingPhase(conference: Conference){
        console.log("ENDING THE BIDDING PHASE");
        this.startReviewPhase(conference);
        return 0;
    }

    async updateBiddingPhase(conference: Conference){
        clearTimeout(biddingTimer);
        biddingTimer = setTimeout(() => this.endBiddingPhase(conference), (conference.biddingDeadline * 1000));
    }

    async startReviewPhase(conference: Conference){
        console.log("STARTING THE REVIEW PHASE");
        reviewTimer = setTimeout(() => this.endReviewPhase(conference), (conference.reviewDeadline * 1000));
        return 0;
    }
    
    async endReviewPhase(conference: Conference){
        console.log("ENDING THE REVIEW PHASE");
        this.startJudgementPhase(conference);
        return 0;
    }

    async updateReviewPhase(conference: Conference){
        clearTimeout(reviewTimer);
        reviewTimer = setTimeout(() => this.endReviewPhase(conference), (conference.reviewDeadline * 1000));
    }

    async startJudgementPhase(conference: Conference){
        console.log("STARTING THE JUDGEMENT PHASE");
        //TESTING
        const time = 5;
        judgementTimer = setTimeout(() => this.endJudgementPhase(conference), (time * 1000));
        return 0;
    }
    
    async endJudgementPhase(conference: Conference){
        console.log("ENDING THE JUDGEMENT PHASE");
        this.startAnnouncementPhase(conference);
        return 0;
    }

    async updateJudgementPhase(conference: Conference){
        clearTimeout(judgementTimer);
        //TESTING
        const time = 5;
        judgementTimer = setTimeout(() => this.endJudgementPhase(conference), (time * 1000));
    }

    async startAnnouncementPhase(conference: Conference){
        console.log("STARTING THE ANNOUNCEMENT PHASE");
        announcementTimer = setTimeout(() => this.endAnnouncementPhase(), (conference.announcementTime * 1000));
        return 0;
    }
    
    async endAnnouncementPhase(){
        console.log("ENDING THE ANNOUNCEMENT PHASE");
        return 0;
    }

    async updateAnnouncementPhase(conference: Conference){
        clearTimeout(announcementTimer);
        announcementTimer = setTimeout(() => this.endAnnouncementPhase(), (conference.announcementTime * 1000));
    }
}