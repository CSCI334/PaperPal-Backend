import { AccountStatus, AccountType } from "@model/Account";

export interface TokenData{
    accountId: number;
    email: string;
    accountType: AccountType;
    accountStatus: AccountStatus;
    conferenceId: number;
}