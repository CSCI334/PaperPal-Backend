// The papers available to you is different according to your accountType
interface PaperStrategy{
    getAvailablePapers() : Promise<string>;
    getPaper(id : number) : Promise<string>;
}

export default PaperStrategy;