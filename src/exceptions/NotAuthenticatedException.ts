import { STATUS_CODE } from "../constants/HttpConstants.js";
import BaseHttpError from "../helper/BaseHttpException.js";

export default class NotAuthenticatedException extends BaseHttpError {
    constructor(message: string) {
        super(message);
        this.statusCode = STATUS_CODE.FORBIDDEN;
    }
}
