export default class Account {
    id: number;
    username: string;
    email: string;
    hashedPassword: string;
    accountType: AccountType;
    accountStatus: AccountStatus;
    salt: string;
}

export type AccountType = "CHAIR" | "REVIEWER" | "AUTHOR" | "ADMIN";
export type AccountStatus = "PENDING" | "REJECTED" | "ACCEPTED" | "ADMIN";