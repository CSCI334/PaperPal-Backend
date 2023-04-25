import { ValidationError } from "express-validator";
import { STATUS_CODE } from "../constants/HttpConstants.js";
import BaseHttpException from "../helper/BaseHttpException.js";

export default class ValidationException extends BaseHttpException {
    constructor(error: ValidationError) {
        super(error.msg);
        this.statusCode = STATUS_CODE.INVALID_INPUT;
    }
}
