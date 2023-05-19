import { AccountStatus, AccountType } from "./database/models/Account.js";
import "express";

declare global {
    namespace Express {
        export interface Locals{
            accountId: number;
            email: string;
            accountStatus: AccountStatus;
            accountType: AccountType;
            conferenceId: number;
        }
    }
}