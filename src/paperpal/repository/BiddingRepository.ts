import { inject, injectable } from "inversify";
import DbService from "../../database/db.js";

@injectable()
export default class BiddingRepository{
    constructor(@inject(DbService) private readonly db: DbService) {}

    async insertBid(){
        return;
    }


}