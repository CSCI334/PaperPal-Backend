import { inject, injectable } from "inversify";
import InviteDTO from "../../types/dto/InviteDTO.js";
import ConferenceRepository from "../../repository/ConferenceRepository.js";
import AccountService from "../account/AccountService.js";
import CreateConferenceDTO from "../../types/dto/CreateConferenceDTO.js";
import UpdateConferenceDTO from "../../types/dto/UpdateConferenceDTO.js";
import InvalidInputException from "../../../exceptions/InvalidInputException.js";
import { ConferencePhase } from "../../types/ConferencePhase.js";

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
        const data = this.accountService.register(new InviteDTO(conferenceDTO.chairEmail, conferenceDTO.chairName, "CHAIR", id));
        return data;
    }

    // TODO : Remember to make a utility function to move to next phase, the functions should simply shift around the epoch of the conference
    async getCurrentPhase(conferenceId : number) : Promise<ConferencePhase> {
        const currentEpoch = Date.now();
        const data = await this.conferenceRepository.getConference(conferenceId);
        if(currentEpoch < data.submissiondeadline) return "SUBMISSION";
        else if(currentEpoch > data.submissiondeadline && currentEpoch < data.biddingdeadline) return "BIDDING";
        else if(currentEpoch > data.biddingdeadline && currentEpoch < data.reviewDeadline) return "REVIEW";
        else if(currentEpoch > data.reviewDeadline && currentEpoch < data.announcementtime) return "JUDGEMENT";
        else if(currentEpoch > data.announcementtime) return "ANNOUNCEMENT";
    }
}