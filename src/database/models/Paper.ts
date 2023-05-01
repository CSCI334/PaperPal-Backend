interface Paper {
    id: number;
    title: string;
    filelocation: string;
    paperstatus : PaperStatus;
    paperid: number;
    authorid: number;
    coauthors: string;
}
export default Paper;
export type PaperStatus = "ACCEPTED" | "REJECTED" | "TBD"