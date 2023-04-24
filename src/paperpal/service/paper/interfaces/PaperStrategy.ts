// The papers available to you is different according to your accountType
interface PaperStrategy{
    getAvailablePapers(accountId : number) : Promise<string>;
    getPaper(paperId : number) : Promise<string>;
}

export default PaperStrategy;