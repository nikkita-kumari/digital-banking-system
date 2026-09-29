import {z} from "zod";
import { NextFunction, Request, Response } from "express";

export const errorHandler = (
    err: unknown,
    req: Request,
    res: Response,
    next: NextFunction
)=>{
    console.error(err);

    if (err instanceof z.ZodError) {
        res.status(400).json({
            error: {
                code: "VALIDATION_ERROR",
                message: "Invalid request data",
                details: err.issues.map((issue) => ({
                    field: issue.path.join("."),
                    message: issue.message
                }))
            }
        });

        return;
    }


    if(
        typeof err==="object" &&
        err!==null &&
        "code" in err &&
        err.code === "23505"
    ){
        res.status(409).json({
            error:{
                code: "EMAIL_ALREADY_EXISTS",
                message: "A user with this email already exists"
            }
        })
        return;
    }
    
    res.status(500).json({
        code: "INTERNAL_SERVER_ERROR",
        message: "Something went wrong",
    })
}