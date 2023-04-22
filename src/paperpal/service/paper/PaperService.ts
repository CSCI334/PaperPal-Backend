import { injectable, inject } from "inversify";
import PaperRepository from "../../repository/PaperRepository.js";
import AuthorPaperStrategy from "./impl/AuthorPaperStrategy.js";
import ChairPaperStrategy from "./impl/ChairPaperStrategy.js";
import ReviewerPaperStrategy from "./impl/ReviewerPaperStrategy.js";

@injectable()
export default class PaperService {
    constructor(
        @inject(AuthorPaperStrategy) private readonly authorPaperStrategy : AuthorPaperStrategy,
        @inject(ReviewerPaperStrategy) private readonly reviewerPaperStrategy : ReviewerPaperStrategy,
        @inject(ChairPaperStrategy) private readonly chairPaperStrategy : ChairPaperStrategy,
        @inject(PaperRepository) private readonly PaperRepository : PaperRepository) {}
    }