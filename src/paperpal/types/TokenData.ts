import { AccountType } from "@model/Account";


export interface TokenData{
    accountId: number;
    email: string;
    accountType: AccountType;
    conferenceId: number;
}