import { LooseObject } from "@utils/LooseObject";
import { Response } from "express";

export default class BaseHttpResponse {
    public data: LooseObject = {};
    public statusCode = 200;

    constructor(data?: LooseObject , statusCode?: number) {
        this.data = data ?? {};
        this.statusCode = statusCode || 200;
    }

    public toExpressResponse(res: Response) {
        return res.status(this.statusCode).json(this.data);
    }

    public static success(data: LooseObject, statusCode = 200): BaseHttpResponse {
        return new BaseHttpResponse(data, statusCode);
    }

    public static failure(data: LooseObject, statusCode = 500): BaseHttpResponse {
        return new BaseHttpResponse(data, statusCode);
    }
}
