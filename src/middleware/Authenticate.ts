import { TokenData } from "@app/paperpal/types/TokenData";
import { SECRET } from "@config/Secret";
import NotAuthenticatedException from "@exception/NotAuthenticatedException";
import BaseMiddleware from "@helper/BaseMiddleware";
import { AccountType } from "@model/Account";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export class Authenticate extends BaseMiddleware{
    private accountType : AccountType[] = [];
    private allowPending;
    constructor(allowPending = false, ...accountType : AccountType[]){
        super();
        this.accountType = accountType;
        this.allowPending = allowPending;
    }

    public handler = async (req : Request, res : Response, next: NextFunction) => {
        const bearer = req.headers.authorization ?? "";
        try{
            if(!bearer.length) next(new NotAuthenticatedException("Invalid token"));
            const token = bearer.split("Bearer")[1].trim();
            const decoded = jwt.verify(token, SECRET.PRIVATE_KEY) as TokenData;
            res.locals = {
                accountType : decoded.accountType,
                accountId : decoded.accountId,
                email: decoded.email,
                conferenceId: decoded.conferenceId,
                accountStatus: decoded.accountStatus,
            };
            req.body.token = token;
            if(decoded.accountStatus === "PENDING" && !this.allowPending) 
                next(new NotAuthenticatedException("User not verified"));
            if(this.accountType.length > 0 && !this.accountType.includes(decoded.accountType))
                next(new NotAuthenticatedException(`User not authenticated for this operation. User is not of type ${this.accountType}`));
            next();
        } catch (err) {
            next(new NotAuthenticatedException((err as Error).message));
        }
    };
    static any = () => {
        return new Authenticate().handler;
    };
    static for = (...accountType: AccountType[]) => {
        return new Authenticate(false, ...accountType).handler;
    };
    static allowPending = () =>{
        return new Authenticate(true).handler;
    };
}