import { LooseObject } from "../../../../common/LooseObject.js";
import Account from "../../../../database/models/Account.js";
import { ConferencePhase } from "../../../types/ConferencePhase.js";

// The papers available to you is different according to your accountType
interface PaperStrategy{
    getAvailablePapers(user : Account, phase? : ConferencePhase) : Promise<LooseObject>;
    getPaperFile(user: Account, paperId : number, phase? : ConferencePhase) : Promise<LooseObject>;
}

export default PaperStrategy;