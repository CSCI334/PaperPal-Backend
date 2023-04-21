import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { SECRET } from "../config/Secret.js";
import BaseMiddleware from "../interfaces/BaseMiddleware.js";
import NotAuthenticatedException from "../exceptions/NotAuthenticatedException.js";

export class Authenticate extends BaseMiddleware{
    public handler = async (req : Request, res : Response, next: NextFunction) => {
        const token = req.headers.authorization;
        jwt.verify(token, SECRET.PRIVATE_KEY, (err, decodedToken) => {
            if(err) next(new NotAuthenticatedException(err.message));

            res.locals.token = token;
            res.locals.decodedToken = decodedToken;
            next();
        });
    };
    static use = () => {return new Authenticate().handler;};
}