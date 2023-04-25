export default class Account {
    constructor(
        public id: number,
        public username: string,
        public email: string,
        public hashedpassword: string,
        public accounttype: AccountType,
        public accountstatus: AccountStatus,
        public salt: string,
        public conferenceid: number,
    ) {}
}

export type AccountType = "CHAIR" | "REVIEWER" | "AUTHOR" | "ADMIN";
export type AccountStatus = "PENDING" | "REJECTED" | "ACCEPTED" | "ADMIN";