import { ConferencePhase } from "@app/paperpal/types/ConferencePhase";
import Account from "@model/Account";
import { LooseObject } from "@utils/LooseObject";



// The papers available to you is different according to your accountType
interface PaperStrategy{
    getAvailablePapers(user : Account, phase? : ConferencePhase) : Promise<LooseObject>;
    getPaperFileLocation(user: Account, paperId : number, phase? : ConferencePhase) : Promise<string>;
}

export default PaperStrategy;