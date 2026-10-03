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


    if (err instanceof Error && err.message === "ACCOUNT_NOT_FOUND") {
        res.status(404).json({
            error: {
            code: "ACCOUNT_NOT_FOUND",
            message: "Account not found"
            }
        });
        return;
    }

    if (err instanceof Error && err.message === "INVALID_ACCOUNT_ID") {
        res.status(400).json({
            error: {
            code: "INVALID_ACCOUNT_ID",
            message: "Invalid account ID"
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

    if (err instanceof Error && err.message === "INSUFFICIENT_FUNDS") {
        res.status(400).json({
            error: {
                code: "INSUFFICIENT_FUNDS",
                message: "Insufficient account balance"
            }
        });
        return;
    }
    
    res.status(500).json({
        code: "INTERNAL_SERVER_ERROR",
        message: "Something went wrong",
    })
}