import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { SECRET } from "../config/Secret.js";
import BaseMiddleware from "../interfaces/BaseMiddleware.js";
import NotAuthenticatedException from "../exceptions/NotAuthenticatedException.js";
import { AccountType } from "../database/models/Account.js";
import { JwtPayload } from "jsonwebtoken";

export class Authenticate extends BaseMiddleware{
    private accountType? : AccountType;
    constructor(accountType? : AccountType){
        super();
        this.accountType = accountType;
    }

    public handler = async (req : Request, res : Response, next: NextFunction) => {
        const token = req.headers.authorization;
        jwt.verify(token, SECRET.PRIVATE_KEY, (err, decodedToken : JwtPayload) => {
            
            if(err) next(new NotAuthenticatedException(err.message));
            if(this.accountType && decodedToken.accountType === this.accountType)  
                next(new NotAuthenticatedException(`User not authenticated for this operation. User is not of type ${this.accountType}`));
            
            res.locals.token = token;
            res.locals.decodedToken = decodedToken;
            res.locals.accountType = decodedToken.accountType;
            res.locals.uid = decodedToken.uid;
            next();
        });
    };
    static any = () => {return new Authenticate().handler;};
    static for = (accountType: AccountType) => {
        return new Authenticate(accountType).handler;
    };
}