import { NextFunction, Request, Response } from "express";
import { inject } from "inversify";
import ForbiddenException from "@exception/ForbiddenException";
import NotFoundException from "@exception/NotFoundException";
import ConferenceRepository from "@app/paperpal/repository/ConferenceRepository";
import { ConferencePhase } from "@app/paperpal/types/ConferencePhase";
import ConferenceUtils from "@service/conference/ConferenceUtils";
import BaseMiddleware from "@helper/BaseMiddleware";


export default class Phase extends BaseMiddleware {
    public readonly phases: ConferencePhase[];
    @inject(ConferenceRepository) private readonly conferenceRepository! : ConferenceRepository;
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