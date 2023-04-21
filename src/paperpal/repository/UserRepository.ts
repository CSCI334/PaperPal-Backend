import { inject, injectable } from "inversify";
import DbService from "../../database/db.js";

@injectable()
export default class UserRepository{
    constructor(@inject(DbService) private readonly db: DbService) {}

}