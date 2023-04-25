import { inject } from "inversify";
import BidRepository from "../../repository/BidRepository.js";

export default class BidService {
    constructor(@inject(BidRepository) private readonly bidRepository : BidRepository) {} 
    getBids() {
        throw new Error("Method not implemented.");
    }
    setWorkload() {
        throw new Error("Method not implemented.");
    }
    addBid() {
        this.bidRepository.insertBid();
        throw new Error("Method not implemented.");
    }
}