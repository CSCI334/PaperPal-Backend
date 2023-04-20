import { NextFunction, Request, Response } from "express";
import DatabaseException from "../exceptions/DatabaseException.js";
import InvalidInputException from "../exceptions/InvalidInputException.js";
import NotFoundException from "../exceptions/NotFoundException.js";
import ValidationException from "../exceptions/ValidationException.js";
export const errorHandler = (
    err: unknown,
    req: Request,
    res: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    next: NextFunction
) => {
    if (err instanceof ValidationException)
        return res.status(err.statusCode).json(err.error);  
    else if(err instanceof SyntaxError) 
        return res.status(400).json({msg: err.message});
    else if (err instanceof NotFoundException
        || err instanceof InvalidInputException
        || err instanceof DatabaseException)
        return res.status(err.statusCode).json({ msg: err.message });
    
    console.log(err);
    return res.status(500).json("Unexpected server side error");
};
