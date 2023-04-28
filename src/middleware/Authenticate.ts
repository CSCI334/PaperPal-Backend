import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { SECRET } from "../config/Secret.js";
import BaseMiddleware from "../helper/BaseMiddleware.js";
import NotAuthenticatedException from "../exceptions/NotAuthenticatedException.js";
import { AccountType } from "../database/models/Account.js";
import { JwtPayload } from "jsonwebtoken";


export class Authenticate extends BaseMiddleware{
    private accountType? : AccountType[];
    constructor(...accountType : AccountType[]){
        super();
        this.accountType = accountType;

        // Temporary, makes it so that admin can do anything just cause they're cool like that
        this.accountType.push("ADMIN");
    }

    public handler = async (req : Request, res : Response, next: NextFunction) => {
        const token = req.headers.authorization.split(" ")[1];
        try{
            const decoded = jwt.verify(token, SECRET.PRIVATE_KEY) as JwtPayload;
            res.locals = {
                token : decoded,
                accountType : decoded.accountType,
                accountId : decoded.uid,
                email: decoded.email,
                conferenceId: decoded.conferenceId
            };
            if(this.accountType.length > 0 && !this.accountType.includes(decoded.accountType))
                next(new NotAuthenticatedException(`User not authenticated for this operation. User is not of type ${this.accountType}`));
            next();
        } catch (err) {
            next(new NotAuthenticatedException(err.message));
        }
    };
    static any = () => {
        return new Authenticate().handler;
    };
    static for = (...accountType: AccountType[]) => {
        return new Authenticate(...accountType).handler;
    };
}