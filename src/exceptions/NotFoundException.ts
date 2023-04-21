import { STATUS_CODE } from "../constants/HttpConstants.js";
import BaseHttpError from "../interfaces/BaseHttpError.js";

export default class NotFoundException extends BaseHttpError {
    constructor(message: string) {
        super(message);
        this.statusCode = STATUS_CODE.NOT_FOUND;
    }
}
