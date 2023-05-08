
import ConferenceRepository from "@app/paperpal/repository/ConferenceRepository";
import { ConferencePhase, numToPhase } from "@app/paperpal/types/ConferencePhase";
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

    async moveToNextPhase() {
        const currentDate = epochToDate(Date.now());
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
        console.log(numToPhase[ConferenceUtils.getConferencePhase(data)]);
        return data;
    }
}