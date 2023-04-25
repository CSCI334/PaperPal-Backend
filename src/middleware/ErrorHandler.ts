import { NextFunction, Request, Response } from "express";
import BaseHttpException from "../helper/BaseHttpException.js";
import ErrorMiddleware from "../helper/ErrorMiddleware.js";
import BaseHttpResponse from "../helper/BaseHttpResponse.js";

export default class ErrorHandler extends ErrorMiddleware {
    public handler = async (
        err: Error,
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        const response = BaseHttpResponse.failure({ message: err.message }, 500);
        if (err instanceof BaseHttpException) {
            response.statusCode = err.statusCode;
            return response.toExpressResponse(res);  
        }
        else if(err instanceof SyntaxError) {
            const response = BaseHttpResponse.failure({ message: err.message }, 400);
            return response.toExpressResponse(res);
        }
        
        response.data = { message: "Unexpected server side error" };
        return response.toExpressResponse(res);
    };
}
