import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import ForbiddenException from "@exception/ForbiddenException";
import NotFoundException from "@exception/NotFoundException";
import ConferenceRepository from "@app/paperpal/repository/ConferenceRepository";
import ConferenceUtils from "@service/conference/ConferenceUtils";
import { BaseMiddleware } from "inversify-express-utils";
import { ConferencePhase } from "@app/paperpal/types/ConferencePhase";
import { numToPhase } from "@app/paperpal/types/ConferencePhase";

@injectable()
export default class ValidatePhase extends BaseMiddleware {
    constructor(
        @inject(ConferenceRepository) private readonly conferenceRepository : ConferenceRepository
    ) {
        super();
    }
    
    public handler = async (req: Request, res: Response, next: NextFunction) => {
        const phases = res.locals.phase as ConferencePhase[];
        const phasesString = [];
        for(const phase of phases) {
            phasesString.push(numToPhase[phase]);
        }

        if(!res.locals.conferenceId) next(new NotFoundException("User does not belong to any conference"));
    
        const conference = await this.conferenceRepository.getConference(res.locals.conferenceId);
        if(!conference) next(new NotFoundException("Conference not found"));
        
        const currentPhase = ConferenceUtils.getConferencePhase(conference);
        if(res.locals.phaseType === "CURRENT") {
            if(!phases.includes(currentPhase)) next(new ForbiddenException(`Conference is not currently in ${phasesString} phase`));
        }
        else if(res.locals.phaseType === "PASSED") { 
            if(!(currentPhase > phases[0])) next(new ForbiddenException(`Conference has not yet passed ${phasesString} phase`));
        }
        next();
    };
}