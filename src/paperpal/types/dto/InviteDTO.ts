import RegisterDTO from "@app/paperpal/types/dto/RegisterDTO";
import { AccountType } from "@model/Account";
import { body } from "express-validator";

export default class InviteDTO extends RegisterDTO {
    constructor(
        public readonly email: string, 
        public readonly username: string, 
        public readonly accountType: AccountType) {
        super(email, username, "", accountType);
    }
    static validator = () => {
        return [...RegisterDTO.validator(), 
            body("accountType", "accountType field does not exist").exists(),
            body("accountType", "accountType field is invalid. Value can only be CHAIR, REVIEWER, or AUTHOR").isIn([
                "CHAIR", "REVIEWER", "AUTHOR"
            ]),
        ];
    };
}
