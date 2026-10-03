import type { NextFunction, Request, Response } from "express";
import { depositMoney, withdrawMoney } from "../services/transaction.service.js";
import { depositSchema , withdrawSchema} from "../validations/transaction.validation.js";

export const deposit = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = depositSchema.parse(req.body);

    const accountId = req.params.accountId;

    if (Array.isArray(accountId)) {
        throw new Error("INVALID_ACCOUNT_ID");
    }

    const result = await depositMoney(
      req.user!.id,
      accountId,
      data.amount
    );

    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const withdraw = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = withdrawSchema.parse(req.body);

    const accountId = req.params.accountId;

    if (Array.isArray(accountId)) {
      throw new Error("INVALID_ACCOUNT_ID");
    }

    const result = await withdrawMoney(
      req.user!.id,
      accountId,
      data.amount
    );

    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};