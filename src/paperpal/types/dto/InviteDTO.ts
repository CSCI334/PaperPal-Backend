import RegisterDTO from "@app/paperpal/types/dto/RegisterDTO";
import { AccountType } from "@model/Account";
import { body } from "express-validator";

export default class InviteDTO extends RegisterDTO {
    constructor(
        public readonly email: string, 
        public readonly username: string, 
        public readonly accountType: AccountType,
        public readonly conferenceId : number) {
        super(email, username, "", accountType, conferenceId);
    }
    static validator = () => {
        return [...RegisterDTO.validator(), 
            body("accountType", "accountType field does not exist").exists(),
            body("accountType", "accountType field is invalid. Value can only be ADMIN, CHAIR, REVIEWER, or AUTHOR").isIn([
                "ADMIN", "CHAIR", "REVIEWER", "AUTHOR"
            ]),
        ];
    };
}
