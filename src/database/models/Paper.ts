export default class Paper {
    constructor(
        public readonly id: number,
        public readonly title: string,
        public readonly filelocation: string,
        public readonly paperstatus : PaperStatus,
        public readonly paperid: number,
        public readonly authorid: number,
        public readonly coauthors: string[],
    ) {}
}

export type PaperStatus = "ACCEPTED" | "REJECTED" | "TBD"