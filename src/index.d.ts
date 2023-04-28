import { AccountType } from "./database/models/Account.js";
import "express";

declare global {
    namespace Express {
        export interface Locals{
            accountId: number;
            email: string;
            accountType: AccountType;
            conferenceId: number;
        }
    }
}