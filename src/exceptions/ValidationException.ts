import { ValidationError } from "express-validator";
import { STATUS_CODE } from "../constants/HttpConstants.js";
import BaseHttpError from "../helper/BaseHttpException.js";

export default class ValidationException extends BaseHttpError {
    constructor(error: ValidationError) {
        super(error.msg);
        this.statusCode = STATUS_CODE.INVALID_INPUT;
    }
}
