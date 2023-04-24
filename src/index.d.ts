import { JwtPayload } from "jsonwebtoken";
import { AccountType } from "./database/models/Account.ts";

declare global {
    namespace Express {
        export interface Locals{
            uid: number;
            email: string;
            accountType: AccountType;
            token: JwtPayload;
        }
    }
}