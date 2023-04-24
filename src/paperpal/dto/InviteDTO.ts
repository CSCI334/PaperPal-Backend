import { AccountType } from "../../database/models/Account.js";
import RegisterDTO from "./RegisterDTO.js";

export default class InviteDTO extends RegisterDTO {
    constructor(
        public readonly email: string, 
        public readonly username: string, 
        public readonly accountType: AccountType,
        public readonly conferenceId : number) {
        super(email, username, null, accountType, conferenceId);
    }
    static validator = [...RegisterDTO.validator];
}
