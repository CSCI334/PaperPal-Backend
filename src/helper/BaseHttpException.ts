export default abstract class BaseHttpException extends Error {    
    constructor(message: string, public statusCode = 500) {
        super(message);
        this.statusCode = statusCode;
    }
}