import { injectable } from "inversify";
import PaperInterface from "../PaperInterface.js";

@injectable()
export default class ReviewerPaperStrategy implements PaperInterface {
    async getAvailablePapers(): Promise<string> {
        throw new Error("Method not implemented.");
    }
    async getPaper(id: number): Promise<string> {
        throw new Error("Method not implemented.");
    }
}