import { STATUS_CODE } from "@app/constants/HttpConstants";
import BaseHttpException from "@helper/BaseHttpException";


export default class ForbiddenException extends BaseHttpException {
    constructor(message: string) {
        super(message);
        this.statusCode = STATUS_CODE.FORBIDDEN;
    }
}
