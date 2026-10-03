import type { NextFunction, Request, Response } from "express";
import { createUserAccount, getUserAccounts } from "../services/account.service.js";
import { createAccountSchema } from "../validations/account.validation.js";

export const createAccount = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = createAccountSchema.parse(req.body);

    const account = await createUserAccount(
      req.user!.id,
      data.accountType,
      data.currency
    );

    res.status(201).json({
      account
    });
  } catch (error) {
    next(error);
  }
};


export const getAccounts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const accounts = await getUserAccounts(req.user!.id);

    res.status(200).json({
      accounts
    });
  } catch (error) {
    next(error);
  }
};