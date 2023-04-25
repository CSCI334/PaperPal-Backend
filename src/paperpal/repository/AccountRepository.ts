import { inject, injectable } from "inversify";
import DbService from "../../database/db.js";
import Account, { AccountStatus } from "../../database/models/Account.js";
import { PgErrorMap } from "../../database/types.js";

@injectable()
export default class AccountRepository {

    constructor(@inject(DbService) private readonly db: DbService) {}
    
    async insertUser(account: Partial<Account>): Promise<number> {
        console.log(account);
        const errorMap: PgErrorMap = new Map([
            ["23505", "Email already used by another account"],
        ]);
        const { rows } = await this.db.query(
            `INSERT INTO account(email, username, hashedpassword, salt, accountType, accountStatus, conferenceId) 
            VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING ID`,
            [   account.email, 
                account.username, 
                account.hashedpassword, 
                account.salt, 
                account.accounttype, 
                account.accountstatus, 
                account.conferenceid],
            errorMap
        );
        return rows[0].id;
    }

    async getAccountByEmail(email: string): Promise<Account> {
        const { rows } = await this.db.query(
            `SELECT * FROM account WHERE email = $1`,
            [email]
        );
        return rows[0] as Account;
    }

    async getAccountById(accountid: number): Promise<Account> {
        const { rows } = await this.db.query(
            `SELECT * FROM account WHERE id = $1`,
            [accountid]
        );

        return rows[0] as Account;
    }

    async updateAccountStatus(accountid: number, accountStatus: AccountStatus): Promise<number> {
        const { rows } = await this.db.query(
            `UPDATE account SET accountstatus = $1 WHERE id = $2 RETURNING id`,
            [accountStatus, accountid]
        );
        return rows[0].id;
    }

    async getAllReviewer(): Promise<Account[]> {
        const { rows } = await this.db.query(
            `SELECT * FROM account`
        );

        return rows as Account[];
    }

    async setUserPasswordAndSalt(password : string, salt : string, accountId: number) {
        const { rows } = await this.db.query(
            `UPDATE account SET hashedPassword = $1, salt = $2 WHERE id = $3 RETURNING id`,
            [password, salt, accountId]
        );
        return rows[0].id;
    }
}
