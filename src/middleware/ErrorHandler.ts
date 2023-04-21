import { NextFunction, Request, Response } from "express";
import BaseHttpError from "../interfaces/BaseHttpError.js";
export const errorHandler = (
    err: unknown,
    req: Request,
    res: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    next: NextFunction
) => {
    if (err instanceof BaseHttpError)
        return res.status(err.statusCode).json({ message: err.message });  
    else if(err instanceof SyntaxError) 
        return res.status(400).json({msg: err.message});
    
    console.log(err);
    return res.status(500).json("Unexpected server side error");
};
