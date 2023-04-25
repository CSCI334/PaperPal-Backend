export default class Paper {
    id: number;
    title: string;
    paperstatus : PaperStatus;
    reviewerid: number;
    paperid: number;
}

export type PaperStatus = "ACCEPTED" | "REJECTED" | "IN REVIEW"