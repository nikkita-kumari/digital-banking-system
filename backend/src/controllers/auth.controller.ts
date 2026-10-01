import type { NextFunction, Request, Response } from "express";
import { loginUser, getCurrentUser as getCurrentUserService } from "../services/auth.service.js";
import { loginUserSchema } from "../validations/auth.validation.js";

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = loginUserSchema.parse(req.body);

    const result = await loginUser(
      data.email,
      data.password
    );

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getCurrentUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await getCurrentUserService(req.user!.id);

    res.status(200).json({
      user
    });
  } catch (error) {
    next(error);
  }
};