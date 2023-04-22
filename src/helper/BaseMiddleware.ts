import { Request, Response, NextFunction } from "express";

export default abstract class BaseMiddleware {
    public abstract handler(
        req: Request,
        res: Response,
        next: NextFunction
    ): void | Promise<void>;
}
