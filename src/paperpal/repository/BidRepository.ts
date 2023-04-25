import { inject, injectable } from "inversify";
import DbService from "../../database/db.js";

@injectable()
export default class BidRepository{
    constructor(@inject(DbService) private readonly db: DbService) {}

    async insertBid(){
        return;
    }


}