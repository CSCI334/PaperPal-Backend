import RegisterDTO from "@app/paperpal/types/dto/RegisterDTO";
import { AccountType } from "@model/Account";

export default class InviteDTO extends RegisterDTO {
    constructor(
        public readonly email: string, 
        public readonly username: string, 
        public readonly accountType: AccountType,
        public readonly conferenceId : number) {
        super(email, username, "", accountType, conferenceId);
    }
    static validator = () => {
        return [...RegisterDTO.validator()];
    };
}
