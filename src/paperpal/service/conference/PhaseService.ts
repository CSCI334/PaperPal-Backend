import { inject, injectable } from "inversify";
import ForbiddenException from "@exception/ForbiddenException";
import NotFoundException from "@exception/NotFoundException";
import ConferenceRepository from "@app/paperpal/repository/ConferenceRepository";
import { ConferencePhase } from "@app/paperpal/types/ConferencePhase";
import ConferenceUtils from "@service/conference/ConferenceUtils";

@injectable()
export default class PhaseService {
    constructor(
        @inject(ConferenceRepository) private readonly conferenceRepository : ConferenceRepository
    ) {}

    async isCurrently(conferenceId: number, ...phases : ConferencePhase[]) {
        const conference = await this.conferenceRepository.getConference(conferenceId);
        if(!conference) throw new NotFoundException("Conference not found");
        
        const currentPhase = ConferenceUtils.getConferencePhase(conference);
        if(!phases.includes(currentPhase)) throw new ForbiddenException(`Conference is not currently in ${phases} phase`);
        return true;
    }

    async hasPassed(conferenceId: number, phase : ConferencePhase) {
        if(!conferenceId) throw new NotFoundException("User does not belong to any conference");

        const conference = await this.conferenceRepository.getConference(conferenceId);
        if(!conference) throw new NotFoundException("Conference not found");

        const currentPhase = ConferenceUtils.getConferencePhase(conference);
        if(!(currentPhase > phase)) throw new ForbiddenException(`Conference has not yet passed ${phase} phase`);
        return true;
    }
}