export default abstract class BaseHttpException extends Error {
    statusCode : number;
    
    constructor(message: string) {
        super(message);
    }
}