import "dotenv/config";
import { randomUUID } from "node:crypto";
import pool from "../config/database.js";
import {
  createTransaction,
  createLedgerEntry
} from "../repositories/transaction.repository.js";
import { increaseAccountBalance,findAccountByIdAndUserId, findAccountByIdAndUserIdForUpdate, decreaseAccountBalance } from "../repositories/account.repository.js";

export const depositMoney = async (
  userId: string,
  accountId: string,
  amount: number
) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const account = await findAccountByIdAndUserId(
      client,
      accountId,
      userId
    );
    if (!account) {
      throw new Error("ACCOUNT_NOT_FOUND");
    }

    const transaction = await createTransaction(
      client,
      randomUUID(),
      "DEPOSIT",
      `Deposit into account ${accountId}`
    );

    await createLedgerEntry(
      client,
      transaction.id,
      accountId,
      "CREDIT",
      amount
    );

    const updatedAccount = await increaseAccountBalance(
      client,
      accountId,
      amount
    );

    await client.query("COMMIT");

    return {
      transaction,
      account: updatedAccount,
    };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

export const withdrawMoney = async (
  userId: string,
  accountId: string,
  amount: number
) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const account = await findAccountByIdAndUserIdForUpdate(
      client,
      accountId,
      userId
    );

    if (!account) {
      throw new Error("ACCOUNT_NOT_FOUND");
    }

    if (Number(account.balance) < amount) {
      throw new Error("INSUFFICIENT_FUNDS");
    }

    const transaction = await createTransaction(
      client,
      randomUUID(),
      "WITHDRAWAL",
      `Withdrawal from account ${accountId}`
    );

    await createLedgerEntry(
      client,
      transaction.id,
      accountId,
      "DEBIT",
      amount
    );

    const updatedAccount = await decreaseAccountBalance(
      client,
      accountId,
      amount
    );

    await client.query("COMMIT");

    return {
      transaction,
      account: updatedAccount
    };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};