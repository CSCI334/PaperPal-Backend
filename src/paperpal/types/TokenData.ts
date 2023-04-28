import { AccountType } from "../../database/models/Account.js";

export interface TokenData{
    accountId: number;
    email: string;
    accountType: AccountType;
    conferenceId: number;
}