export default abstract class BaseHttpError extends Error {
    statusCode : number;
    
    constructor(message: string) {
        super(message);
    }
}