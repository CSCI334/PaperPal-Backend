import DbService from "@app/database/db";
import { PgErrorMap } from "@app/database/types";
import Account, { AccountStatus } from "@model/Account";
import Author from "@model/Author";
import Chair from "@model/Chair";
import Reviewer from "@model/Reviewer";
import { LooseObject } from "@utils/LooseObject";
import { inject, injectable } from "inversify";


@injectable()
export default class AccountRepository {
    constructor(@inject(DbService) private readonly db: DbService) {}
    
    async insertUser(account: Partial<Account>) {
        const errorMap: PgErrorMap = new Map([
            ["uniqueemailandconference", "Email already used in this conference"],
        ]);
        const { rows } = await this.db.query(
            `INSERT INTO account(email, username, hashedpassword, salt, accountType, accountStatus, conferenceId) 
            VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
            [   account.email, 
                account.username, 
                account.hashedpassword, 
                account.salt, 
                account.accounttype, 
                account.accountstatus, 
                account.conferenceid],
            errorMap
        );
        return rows[0] as Account;
    }

    async insertAuthor(author: Partial<Author>) {
        const { rows } = await this.db.query(
            `INSERT INTO author(accountid) 
            VALUES($1) RETURNING *`,
            [author.accountid]);
        return rows[0] as Author;
    }
    
    async insertReviewer(reviewer: Partial<Reviewer>) {
        const constraint : PgErrorMap = new Map();
        constraint.set("uniqueemailandconference", "Reviewer with that email already exists in this conference");
        const { rows } = await this.db.query(
            `INSERT INTO reviewer(accountid) 
            VALUES($1) RETURNING *`,
            [reviewer.accountid],
            constraint);
        return rows[0] as Reviewer;
    }
    
    async insertChair(chair: Partial<Chair>) {
        const { rows } = await this.db.query(
            `INSERT INTO chair(accountid) 
            VALUES($1) RETURNING *`,
            [chair.accountid]);
        return rows[0] as Chair;
    }

    async getAccountByEmail(email: string): Promise<Account> {
        const { rows } = await this.db.query(
            `SELECT * FROM account WHERE email = $1`,
            [email]
        );
        return rows[0] as Account;
    }

    async getAccountByEmailAndConference(email:string, conferenceId: number) {
        const { rows } = await this.db.query(
            `SELECT * FROM account WHERE email=$1 AND conferenceId=$2`,
            [email, conferenceId]
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

    async updateAccountStatus(accountid: number, accountStatus: AccountStatus) {
        const { rows } = await this.db.query(
            `UPDATE account SET accountstatus=$1 WHERE id=$2`,
            [accountStatus, accountid]
        );
        return;
    }

    async getAllReviewer() {
        const { rows } = await this.db.query(
            `SELECT account.id, account.email, account.username, account.accounttype, account.accountstatus FROM account 
            JOIN reviewer ON account.id = reviewer.accountid`
        );
        
        return rows as Account[];
    }

    async setUserPasswordAndSalt(password : string, salt : string, accountId: number) {
        const { rows } = await this.db.query(
            `UPDATE account SET hashedPassword = $1, salt = $2 WHERE id = $3 RETURNING *`,
            [password, salt, accountId]
        );
        return rows[0] as Account;
    }

    async getAuthorByAccountId(accountId: number) {
        const { rows } = await this.db.query(
            `SELECT * FROM author WHERE accountid = $1`, 
            [accountId]
        ); 
        return rows[0] as Author;
    }

    async getReviewerByAccountId(accountId: number) {
        const { rows } = await this.db.query(
            `SELECT * FROM reviewer WHERE accountid = $1`, 
            [accountId]
        ); 
        return rows[0] as Reviewer;
    }

    async getReviewer(id: number) {
        const { rows } = await this.db.query(
            `SELECT * FROM reviewer WHERE id = $1`, 
            [id]
        ); 
        return rows[0] as Reviewer;
    }

    async updateReviewer(reviewerId: number, reviewer: Partial<Reviewer>) {
        const { rows } = await this.db.query(
            `UPDATE reviewer SET 
            bidPoints = COALESCE($2, bidPoints),
            paperworkload = COALESCE($3, paperworkload)
            WHERE id = $1
            RETURNING *`,
            [reviewerId, reviewer.bidpoints, reviewer.paperworkload]
        ); 
        return rows[0] as Reviewer;
    }    

    async getTotalWorkloadInConference(conferenceId: number) {
        const { rows } = await this.db.query(
            `SELECT SUM(reviewer.paperworkload)
            FROM reviewer 
            JOIN account ON reviewer.accountId=account.id
            WHERE account.conferenceId=$1`,
            [conferenceId]
        );
        return rows[0].sum as number;
    }

    async getConferenceInfo(conferenceId: number) {
        const {rows } = await this.db.query(
            `SELECT conference.*, account.username as chair_name, account.email as chair_email
            FROM account
            JOIN conference ON conference.id = account.conferenceid
            WHERE accounttype = 'CHAIR' AND conferenceId = $1
            LIMIT 1`,
            [conferenceId]
        );
        return rows[0] as LooseObject;
    }

    async doesAdminExists() {
        return true;
    }
}
