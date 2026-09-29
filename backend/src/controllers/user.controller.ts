import type {NextFunction, Request, Response } from "express";
import { registerUser } from "../services/user.service.js";
import { registerUserSchema } from "../validations/user.validation.js";

export const register = async (
  req: Request,
  res: Response,
  next:NextFunction
) => {
  try{
    const data= registerUserSchema.parse(req.body);

    const user = await registerUser(
        data.name,
        data.email,
        data.password
    );

    res.status(201).json({
        user
    });
  }catch(error){
    next(error);
  }
};