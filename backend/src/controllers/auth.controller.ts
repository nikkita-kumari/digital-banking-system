import type { NextFunction, Request, Response } from "express";
import { loginUser } from "../services/auth.service.js";
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

export const getCurrentUser = (
  req: Request,
  res: Response
) => {
  res.status(200).json({
    user: req.user
  });
};