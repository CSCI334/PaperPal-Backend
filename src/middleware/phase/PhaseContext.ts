import BaseMiddleware from "@helper/BaseMiddleware";
import { NextFunction } from "express";
import { Request, Response } from "express";
import { ConferencePhase } from "@app/paperpal/types/ConferencePhase";

export default class PhaseContext extends BaseMiddleware {
    public readonly phases: ConferencePhase[];
    public readonly phaseType: "CURRENT" | "PASSED";
    constructor(phaseType: "CURRENT" | "PASSED", ...phases: ConferencePhase[]) {
        super();
        this.phases = phases;
        this.phaseType = phaseType;
    }

    public handler = async (req: Request, res: Response, next: NextFunction) => {
        res.locals.phase = this.phases;
        res.locals.phaseType = this.phaseType;
        if(!this.phases || this.phases.length == 0) next(new Error("Phase not specified"));
        
        next();
    };

    public static isCurrently = (...phases : ConferencePhase[]) => {
        return new PhaseContext("CURRENT", ...phases).handler;
    };

    public static hasPassed = (phases : ConferencePhase) => {
        return new PhaseContext("PASSED", phases).handler;
    };
}