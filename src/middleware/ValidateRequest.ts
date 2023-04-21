import { NextFunction, Request, Response } from "express";
import { ValidationChain, validationResult } from "express-validator";
import ValidationException from "../exceptions/ValidationException.js";
import BaseMiddleware from "../interfaces/BaseMiddleware.js";

export default class ValidateRequest extends BaseMiddleware {
    public readonly dtoValidator: ValidationChain[];

    constructor(dtoValidator: ValidationChain[]) {
        super();
        this.dtoValidator = dtoValidator;
    }

    public handler = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        for (const validator of this.dtoValidator) {
            await validator.run(req);
        }
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const err = new ValidationException(errors.array()[0]);
            next(err);
        }
        next();
    };

    public static using = (dtoValidator: ValidationChain[]) =>
        new ValidateRequest(dtoValidator).handler;
}
