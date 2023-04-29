interface Account {
    id: number;
    username: string;
    email: string;
    hashedpassword: string;
    accounttype: AccountType;
    accountstatus: AccountStatus;
    salt: string;
    conferenceid: number;
}
export default Account;

export type AccountType = "CHAIR" | "REVIEWER" | "AUTHOR" | "ADMIN";
export type AccountStatus = "PENDING" | "REJECTED" | "ACCEPTED" | "ADMIN";