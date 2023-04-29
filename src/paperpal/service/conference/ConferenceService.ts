
import ConferenceRepository from "@app/paperpal/repository/ConferenceRepository";
import { ConferencePhase } from "@app/paperpal/types/ConferencePhase";
import CreateConferenceDTO from "@app/paperpal/types/dto/CreateConferenceDTO";
import InviteDTO from "@app/paperpal/types/dto/InviteDTO";
import UpdateConferenceDTO from "@app/paperpal/types/dto/UpdateConferenceDTO";
import InvalidInputException from "@exception/InvalidInputException";
import NotFoundException from "@exception/NotFoundException";
import Conference from "@model/Conference";
import AccountService from "@service/account/AccountService";
import { inject, injectable } from "inversify";

@injectable()
export default class ConferenceService {
    constructor(
        @inject(ConferenceRepository) private readonly conferenceRepository: ConferenceRepository,
        @inject(AccountService) private readonly accountService : AccountService) {}
        
    async updateConference(conferenceDTO: UpdateConferenceDTO) {
        const data = await this.conferenceRepository.updateConference({
            id: conferenceDTO.conferenceId,
            announcementtime: conferenceDTO.announcementTime,
            biddingdeadline: conferenceDTO.biddingDeadline,
            submissiondeadline: conferenceDTO.submissionDeadline,
            reviewDeadline: conferenceDTO.reviewDeadline,
        });
        return data;
    }
    
    async createConference(conferenceDTO : CreateConferenceDTO) {
        if(conferenceDTO.submissionDeadline > conferenceDTO.biddingDeadline) throw new InvalidInputException("Submission deadline cannot be after bidding deadline");
        if(conferenceDTO.biddingDeadline > conferenceDTO.announcementTime) throw new InvalidInputException("Bidding deadline cannot be after announcement date");
        
        const id = await this.conferenceRepository.insertConference(CreateConferenceDTO.toConferenceModel(conferenceDTO));
        const data = await this.accountService.register(new InviteDTO(conferenceDTO.chairEmail, conferenceDTO.chairName, "CHAIR", id));
        return data;
    }

    async getConferencePhase(conferenceId : number) {
        const conference = await this.conferenceRepository.getConference(conferenceId);
        if(!conference) throw new NotFoundException("Conference not found");
        
        return ConferenceService.getCurrentPhase(conference);
    }

    // TODO : Remember to make a utility function to move to next phase, the functions should simply shift around the epoch of the conference
    public static getCurrentPhase(conference : Conference) : ConferencePhase {
        const currentEpoch = Date.now();

        if(currentEpoch < conference.submissiondeadline) return ConferencePhase.Submission;
        else if(currentEpoch > conference.submissiondeadline && currentEpoch < conference.biddingdeadline) return ConferencePhase.Bidding;
        else if(currentEpoch > conference.biddingdeadline && currentEpoch < conference.reviewDeadline) return ConferencePhase.Review;
        else if(currentEpoch > conference.reviewDeadline && currentEpoch < conference.announcementtime) return ConferencePhase.Judgment;
        else if(currentEpoch > conference.announcementtime) return ConferencePhase.Announcement;

        throw new Error("Invalid value");
    }

    async moveToNextPhase() : Promise<ConferencePhase> {
        throw new Error("Not implemented");
    }
}