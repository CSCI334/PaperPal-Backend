import { STATUS_CODE } from "../constants/HttpConstants.js";
import BaseHttpException from "../helper/BaseHttpException.js";

export default class DatabaseException extends BaseHttpException {
    constructor(message: string) {
        super(message);
        this.statusCode = STATUS_CODE.INVALID_INPUT;
    }
}
