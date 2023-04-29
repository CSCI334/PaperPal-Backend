import { STATUS_CODE } from "@app/constants/HttpConstants";
import BaseHttpException from "@helper/BaseHttpException";
import { ValidationError } from "express-validator";


export default class ValidationException extends BaseHttpException {
    constructor(error: ValidationError) {
        super(error.msg);
        this.statusCode = STATUS_CODE.INVALID_INPUT;
    }
}
