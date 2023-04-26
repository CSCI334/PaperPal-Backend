import { injectable } from "inversify";
import PaperStrategy from "../interfaces/PaperStrategy.js";

@injectable()
export default class ReviewerPaperStrategy implements PaperStrategy {
    // TODO : For bidding phase, return a nice and joined table of Papers and Bids, might need to populate some values when returning
    // TODO : For review phase, return all allocated papers
    async getAvailablePapers(accountId: number): Promise<string> {
        throw new Error("Method not implemented.");
    }
    async getPaper(paperId: number): Promise<string> {
        throw new Error("Method not implemented.");
    }
}