
import ConferenceRepository from "@app/paperpal/repository/ConferenceRepository";
import { ConferencePhase, numToPhase } from "@app/paperpal/types/ConferencePhase";
import CreateConferenceDTO from "@app/paperpal/types/dto/CreateConferenceDTO";
import InviteDTO from "@app/paperpal/types/dto/InviteDTO";
import UpdateConferenceDTO from "@app/paperpal/types/dto/UpdateConferenceDTO";
import InvalidInputException from "@exception/InvalidInputException";
import Conference from "@model/Conference";
import AccountRepository from "@repository/AccountRepository";
import AccountService from "@service/account/AccountService";
import BidService from "@service/bid/BidService";
import ConferenceUtils from "@service/conference/ConferenceUtils";
import { conferenceTimerMap } from "@service/conference/Timeout";
import EmailService from "@service/email/EmailService";
import { createAnnouncementEmail } from "@service/email/template/AnnouncementEmail";
import { epochToDate } from "@utils/utils";
import { inject, injectable } from "inversify";

@injectable()
export default class ConferenceService {
    constructor(
        @inject(ConferenceRepository) private readonly conferenceRepository: ConferenceRepository,
        @inject(AccountRepository) private readonly accountRepository: AccountRepository,
        @inject(AccountService) private readonly accountService : AccountService,
        @inject(BidService) private readonly bidService: BidService,
        @inject(EmailService) private readonly emailService: EmailService
    ) {}
        
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
        
        this.updateConferenceTimers(data);

        return data;
    }
    
    async getConferenceInfo() {
        const conference: Conference = await this.conferenceRepository.getLastConference();
        return await this.accountRepository.getConferenceInfo(conference.id);
    }

    async createConference(conferenceDTO : CreateConferenceDTO) {
        const lastConference = await this.conferenceRepository.getLastConference();

        const deadlines = [
            conferenceDTO.submissionDeadline, 
            conferenceDTO.biddingDeadline, 
            conferenceDTO.reviewDeadline, 
            conferenceDTO.announcementTime];
        
        if(!ConferenceUtils.deadlinesAreInOrder(deadlines)) 
            throw new InvalidInputException("Conference key dates are not valid");
        if(lastConference && ConferenceUtils.getConferencePhase(lastConference) < ConferencePhase.Announcement) 
            throw new InvalidInputException("There is still an ongoing conference");

        const conference: Conference = await this.conferenceRepository.insertConference(CreateConferenceDTO.toConferenceModel(conferenceDTO));
        await this.accountService.register(new InviteDTO(conferenceDTO.chairEmail, conferenceDTO.chairName, "CHAIR"));
        return conference;
    }
    
    // Moves the incoming phase to `now - 100,000 seconds` 
    async moveToNextPhase() {
        const currentDate = epochToDate(Date.now() - (100000 * 1000));
        const conference = await this.conferenceRepository.getLastConference();
        const newDeadlines = {
            id: conference.id,
            submissiondeadline: conference.submissiondeadline,
            biddingdeadline: conference.biddingdeadline,
            reviewdeadline: conference.reviewdeadline,
            announcementtime: conference.announcementtime,
        };

        const currentPhase = ConferenceUtils.getConferencePhase(conference);
        if(currentPhase == ConferencePhase.Submission) newDeadlines.submissiondeadline = currentDate;
        else if(currentPhase == ConferencePhase.Bidding) newDeadlines.biddingdeadline = currentDate;
        else if(currentPhase == ConferencePhase.Review) newDeadlines.reviewdeadline = currentDate;
        else if(currentPhase == ConferencePhase.Judgment) newDeadlines.announcementtime = currentDate;

        const data = await this.conferenceRepository.updateConference(newDeadlines);
        console.log(`Current phase : ${numToPhase[ConferenceUtils.getConferencePhase(data)]}`);
        return data;
    }

    // Moves the previous phase to `now + 100,000 seconds` 
    async moveToPrevPhase() {
        const currentDate = epochToDate(Date.now() + (100000 * 1000));
        const conference = await this.conferenceRepository.getLastConference();
        const newDeadlines = {
            id: conference.id,
            submissiondeadline: conference.submissiondeadline,
            biddingdeadline: conference.biddingdeadline,
            reviewdeadline: conference.reviewdeadline,
            announcementtime: conference.announcementtime,
        };
        const currentPhase = ConferenceUtils.getConferencePhase(conference);

        if(currentPhase == ConferencePhase.Bidding) newDeadlines.submissiondeadline = currentDate;
        else if(currentPhase == ConferencePhase.Review) newDeadlines.biddingdeadline = currentDate;
        else if(currentPhase == ConferencePhase.Judgment) newDeadlines.reviewdeadline = currentDate;
        else if(currentPhase == ConferencePhase.Announcement) newDeadlines.announcementtime = currentDate;
    
        const data = await this.conferenceRepository.updateConference(newDeadlines);
        console.log(`Current phase : ${numToPhase[ConferenceUtils.getConferencePhase(data)]}`);
        
        return data;
    }

    // Not a great implementation, ideally we use cron to do this, or a recursive setTimeout 
    // For now, the time between now and announcementDeadline can only be 24.8 days (32-bit int)
    async startConferenceTimers(conference : Conference){
        const allocateDeadline = conference.biddingdeadline.getTime() - Date.now();
        const announcementDeadline = conference.announcementtime.getTime() - Date.now();
        const MAX_INT = 2147483647;

        let allocateTimer = null;
        if(allocateDeadline > 1 && allocateDeadline < MAX_INT)  {
            allocateTimer = setTimeout(() => {
                console.log(`Allocated paper for conference ${conference.conferencename}`);
                this.bidService.allocateAllPapers();
            }, (allocateDeadline));
        }

        let announcementTimer = null;
        if(announcementDeadline > 1 && announcementDeadline < MAX_INT) {
            announcementTimer = setTimeout(() => {
                console.log(`Sent announcement emails for conference ${conference.conferencename}`);
                this.sendAnnouncementEmails();
            }, (announcementDeadline));
        }

        conferenceTimerMap[conference.id] = {
            allocateTimer: allocateTimer,
            announcementTimer: announcementTimer
        };
        return conferenceTimerMap[conference.id];
    }

    async updateConferenceTimers(conference: Conference) {
        const timers = conferenceTimerMap[conference.id];
        
        if(!timers) return this.startConferenceTimers(conference);
        else if(timers.allocateTimer) clearTimeout(timers.allocateTimer);
        else if(timers.announcementTimer) clearTimeout(timers.announcementTimer);

        return this.startConferenceTimers(conference);
    }

    async sendAnnouncementEmails() {
        const conference = await this.conferenceRepository.getLastConference();
        const emailList = await this.conferenceRepository.getAllEmailFromConference(conference.id);
        const acceptedPapers = await this.conferenceRepository.getAllAcceptedPaperTitles(conference.id);
        const rejectedPapers = await this.conferenceRepository.getAllRejectedPaperTitles(conference.id);
        
        const recipientList = emailList.map(value => value.email);
        const acceptedPaperList = acceptedPapers.map(value => value.title);
        const rejectedPaperList = rejectedPapers.map(value => value.title);
        
        this.emailService.send(createAnnouncementEmail(
            conference,
            recipientList,
            acceptedPaperList,
            rejectedPaperList
        ));
    }
}