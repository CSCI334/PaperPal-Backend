export default class Paper {
    constructor(
        public readonly id: number,
        public readonly title: string,
        public readonly paperstatus : PaperStatus,
        public readonly reviewerid: number[],
        public readonly paperid: number,
        public readonly authorId: number,
        public readonly coAuthors: string[],
    ) {}
}

export type PaperStatus = "ACCEPTED" | "REJECTED" | "IN REVIEW"