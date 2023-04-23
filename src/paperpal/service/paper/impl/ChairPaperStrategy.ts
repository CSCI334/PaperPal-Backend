import { injectable } from "inversify";
import PaperStrategy from "../interfaces/PaperStrategy.js";

@injectable()
export default class ChairPaperStrategy implements PaperStrategy {
    async getAvailablePapers(): Promise<string> {
        throw new Error("Method not implemented.");
    }
    async getPaper(id: number): Promise<string> {
        throw new Error("Method not implemented.");
    }
}