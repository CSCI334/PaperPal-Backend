/* eslint-disable @typescript-eslint/no-explicit-any */

import { DB_RETRY_AMOUNT, DB_RETRY_INTERVAL_IN_SECOND } from "@app/constants/DbConstants";
import { PgErrorMap } from "@app/database/types";
import DatabaseException from "@exception/DatabaseException";
import { sleep } from "@utils/utils";
import { injectable } from "inversify";
import pg, { DatabaseError } from "pg";

@injectable()
export default class DbService {
    readonly pool: pg.Pool;
    constructor() {
        this.pool = new pg.Pool({
            host: process.env.POSTGRES_HOST,
            port: parseInt(process.env.POSTGRES_PORT ?? "5432"),
            database: process.env.POSTGRES_DB,
            user: process.env.POSTGRES_USER,
            password: process.env.POSTGRES_PASSWORD,
        });
    }

    async query(
        query: string,
        values?: any[],
        errorMap?: PgErrorMap
    ): Promise<pg.QueryResult<any>> {
        try {
            return await this.pool.query(query, values);
        } catch (err) {
            const dbError = err as pg.DatabaseError;
            const errConstraint = dbError.constraint || "0"; 
            // Expected Postgres error
            if (errorMap && errorMap.has(errConstraint)) {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                const pgError: string = errorMap.get(errConstraint)!;
                throw new DatabaseException(pgError);
            } 
            // Unexpected errors
            throw err;
        }
    }

    async connect() {
        let retries = 0;
        while(retries <= DB_RETRY_AMOUNT) {
            try{
                console.log(`Attempting DB connection`);
                await this.pool.connect();
                return;
            } catch(err : unknown) {
                retries += 1;
                console.log(`Connection with ${process.env.POSTGRES_HOST}:${process.env.POSTGRES_PORT} failed, retry ${retries}`);
                await sleep(DB_RETRY_INTERVAL_IN_SECOND * 1000);
            }
        }
        console.log("Could not connect to database, exiting program");
        process.exit(1);
    }
}
