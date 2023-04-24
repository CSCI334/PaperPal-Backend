import { injectable } from "inversify";
import PaperStrategy from "../interfaces/PaperStrategy.js";

@injectable()
export default class AuthorPaperStrategy implements PaperStrategy {
    async getAvailablePapers(accountId: number): Promise<string> {
        throw new Error("Method not implemented.");
    }
    async getPaper(paperId: number): Promise<string> {
        throw new Error("Method not implemented.");
    }
}