import { inject, injectable } from "inversify";
import InviteDTO from "../../dto/InviteDTO.js";
import ConferenceRepository from "../../repository/ConferenceRepository.js";
import AccountService from "../account/AccountService.js";
import CreateConferenceDTO from "../../dto/CreateConferenceDTO.js";
import UpdateConferenceDTO from "../../dto/UpdateConferenceDTO.js";

@injectable()
export default class ConferenceService {
    constructor(
        @inject(ConferenceRepository) private readonly conferenceRepository: ConferenceRepository,
        @inject(AccountService) private readonly accountService : AccountService) {}
        
    async updateConference(conferenceDTO: UpdateConferenceDTO) {
        const oldConference = await this.conferenceRepository.getConference(conferenceDTO.conferenceId);
        const data = await this.conferenceRepository.updateConference({
            announcementtime: conferenceDTO.announcementTime ? conferenceDTO.announcementTime : oldConference.announcementtime,
            biddingdeadline: conferenceDTO.biddingDeadline ? conferenceDTO.biddingDeadline : oldConference.biddingdeadline,
            submissiondeadline: conferenceDTO.submissionDeadline ? conferenceDTO.submissionDeadline : oldConference.submissiondeadline,
        });
        return data;
    }
    
    async createConference(conferenceDTO : CreateConferenceDTO) {
        // Insert a new conference, register a new chair account
        const id : number = await this.conferenceRepository.insertConference(conferenceDTO.toConferenceModel());
        const data = this.accountService.register(new InviteDTO(conferenceDTO.chairEmail, conferenceDTO.chairName, "CHAIR", id));
        return data;
    }
}