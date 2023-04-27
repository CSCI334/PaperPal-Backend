import { BaseMiddleware } from "inversify-express-utils";
import { NextFunction, Request, Response } from "express";
import { ConferencePhase } from "../paperpal/types/ConferencePhase.js";
import NotFoundException from "../exceptions/NotFoundException.js";
import ConferenceRepository from "../paperpal/repository/ConferenceRepository.js";
import { inject } from "inversify";
import ConferenceUtils from "../paperpal/service/conference/ConferenceUtils.js";
import ForbiddenException from "../exceptions/ForbiddenException.js";
import ConferenceService from "../paperpal/service/conference/ConferenceService.js";

export default class Phase extends BaseMiddleware {
    public readonly phases: ConferencePhase[];
    @inject(ConferenceRepository) private readonly conferenceRepository : ConferenceRepository;
    @inject(ConferenceService) private readonly conferenceService : ConferenceService;
    constructor(...phases: ConferencePhase[]) {
        super();
        this.phases = phases;
    }

    // Not very dry but i don't want to make another middleware
    public handler = async (req: Request, res: Response, next: NextFunction) => {
        if(!res.locals.conferenceId) next(new NotFoundException("User does not belong to any conference"));

        const conference = await this.conferenceRepository.getConference(res.locals.conferenceId);
        if(!conference) next(new NotFoundException("Conference not found"));

        const currentPhase = ConferenceUtils.getCurrentPhase(conference);
        if(this.phases.includes(currentPhase)) next();
        
        next(new ForbiddenException(`Conference is not currently in ${this.phases} phase`));
    };

    public hasPassedHandler = async (req: Request, res: Response, next: NextFunction) => {
        if(!res.locals.conferenceId) next(new NotFoundException("User does not belong to any conference"));

        const conference = await this.conferenceRepository.getConference(res.locals.conferenceId);
        if(!conference) next(new NotFoundException("Conference not found"));

        const currentPhase = ConferenceUtils.getCurrentPhase(conference);
        if(currentPhase > this.phases[0]) next();

        next(new ForbiddenException(`Conference has not yet passed ${this.phases[0]} phase`));
    };

    public static isCurrently = (phase : ConferencePhase) => {
        return new Phase(phase).handler;
    };

    public static isAnyOf = (...phases : ConferencePhase[]) => {
        return new Phase(...phases).handler;
    };

    public static hasPassed = (phases : ConferencePhase) => {
        return new Phase(phases).hasPassedHandler;
    };
}