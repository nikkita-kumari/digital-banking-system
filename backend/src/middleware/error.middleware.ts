import { NextFunction, Request, Response } from "express";

export const errorHandler = (
    error: unknown,
    req: Request,
    res: Response,
    next: NextFunction
)=>{
    console.error(error);
    
    res.status(500).json({
        code: "INTERNAL_SERVER_ERROR",
        message: "Something went wrong",
    })
}