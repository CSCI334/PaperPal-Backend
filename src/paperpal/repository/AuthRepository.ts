import { inject, injectable } from "inversify";
import DbService from "../../database/db.js";
import Account from "../../database/models/Account.js";
import { PgErrorMap } from "../../database/types.js";

@injectable()
export default class AuthRepository {

    constructor(@inject(DbService) private readonly db: DbService) {}
    
    async insertUser(
        email: string,
        username: string,
        hashedPassword: string,
        salt: string,
        userType: string,
    ): Promise<number> {
        const errorMap: PgErrorMap = new Map([
            ["23505", "Email already used by another account"],
        ]);
        const { rows } = await this.db.query(
            `
            INSERT INTO account(email, username, hashedpassword, salt, accountType) 
            VALUES($1, $2, $3, $4 ,$5)
            RETURNING ID`,
            [email, username, hashedPassword, salt, userType],
            errorMap
        );
        return rows[0].id;
    }

    async getUserByEmail(email: string): Promise<Account> {
        const { rows } = await this.db.query(
            `SELECT * FROM account WHERE email = $1`,
            [email]
        );

        return rows[0] as Account;
    }

    async getUserById(accountid: number): Promise<Account> {
        const { rows } = await this.db.query(
            `SELECT * FROM account WHERE id = $1`,
            [accountid]
        );

        return rows[0] as Account;
    }

    async grantAdminPrivilege(accountid: number): Promise<number> {
        const { rows } = await this.db.query(
            `UPDATE account SET isadmin = true WHERE id = $1 RETURNING id`,
            [accountid]
        );
        return rows[0].id;
    }
}
