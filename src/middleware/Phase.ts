import { BaseMiddleware } from "inversify-express-utils";
import { NextFunction, Request, Response } from "express";
import { ConferencePhase } from "../paperpal/types/ConferencePhase.js";

export default class Phase extends BaseMiddleware {
    public readonly phases: ConferencePhase[];

    constructor(...phases: ConferencePhase[]) {
        super();
        this.phases = phases;
    }

    public handler = async (req: Request, res: Response, next: NextFunction) => {
        throw new Error("Method not implemented.");
    };

    public static isCurrently = (phase : ConferencePhase) => {
        return new Phase(phase).handler;
    };

    public static isAnyOf = (...phases : ConferencePhase[]) => {
        return new Phase(...phases).handler;
    };
}