import { NextFunction, Request, Response } from "express";
import BaseHttpException from "../helper/BaseHttpException.js";
import ErrorMiddleware from "../helper/ErrorMiddleware.js";
import BaseHttpResponse from "../helper/BaseHttpResponse.js";
import { STATUS_CODE } from "../constants/HttpConstants.js";

export default class ErrorHandler extends ErrorMiddleware {
    public handler = async (
        err: Error,
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        const response = BaseHttpResponse.failure({ message: err.message });
        if (err instanceof BaseHttpException) {
            response.statusCode = err.statusCode;
            return response.toExpressResponse(res);  
        }
        else if(err instanceof SyntaxError) {
            response.statusCode = STATUS_CODE.VALIDATION_FAILURE;
            return response.toExpressResponse(res);
        }
        console.log(err);
        response.data = { message: "Unexpected server side error" };
        return response.toExpressResponse(res);
    };
}
