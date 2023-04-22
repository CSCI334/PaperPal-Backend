import { Request, Response, NextFunction } from "express";

export default abstract class ErrorMiddleware {
    public abstract handler(
        err: Error,
        req: Request,
        res: Response,
        next: NextFunction
    ): Response | Promise<Response>;
}