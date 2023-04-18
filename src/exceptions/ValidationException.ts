import { ValidationError } from "express-validator";

export default class ValidationException extends Error {
    public readonly statusCode: number = 422;
    public readonly error: ValidationError;
    constructor(error: ValidationError) {
        super();
        this.error = error;
    }
}
