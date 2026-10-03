import "dotenv/config";
import { randomUUID } from "node:crypto";
import pool from "../config/database.js";
import {
  createTransaction,
  createLedgerEntry
} from "../repositories/transaction.repository.js";
import {
         increaseAccountBalance,
         findAccountByIdAndUserId,
         findAccountByIdAndUserIdForUpdate, 
         decreaseAccountBalance,
         findAccountByIdForUpdate
        } from "../repositories/account.repository.js";

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

export const transferMoney = async (
  userId: string,
  fromAccountId: string,
  toAccountId: string,
  amount: number
) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const firstAccountId = 
        BigInt(fromAccountId) < BigInt(toAccountId)
        ? fromAccountId
        : toAccountId;

    const secondAccountId =
        BigInt(fromAccountId) < BigInt(toAccountId)
        ? toAccountId
        : fromAccountId;

    let fromAccount;
    let toAccount;

    if(firstAccountId === fromAccountId ){
        fromAccount= await findAccountByIdAndUserIdForUpdate(
            client,
            fromAccountId,
            userId
        );
        if(!fromAccount){
            throw new Error("ACCOUNT_NOT_FOUND");
        };

        toAccount =await findAccountByIdForUpdate(
            client,
            toAccountId
        );
    }else{
        toAccount =await findAccountByIdForUpdate(
            client,
            toAccountId
        );
        if(!toAccount){
            throw new Error("ACCOUNT_NOT_FOUND");
        };

        fromAccount= await findAccountByIdAndUserIdForUpdate(
            client,
            fromAccountId,
            userId
        )
    }

    if (!toAccount) {
        throw new Error("ACCOUNT_NOT_FOUND");
    }
    
    if (fromAccount.id === toAccount.id) {
      throw new Error("SAME_ACCOUNT_TRANSFER");
    }

    
    if (fromAccount.currency !== toAccount.currency) {
      throw new Error("CURRENCY_MISMATCH");
    }

    
    if (Number(fromAccount.balance) < amount) {
      throw new Error("INSUFFICIENT_FUNDS");
    }

   
    const transaction = await createTransaction(
      client,
      randomUUID(),
      "TRANSFER",
      `Transfer from account ${fromAccountId} to account ${toAccountId}`
    );

    await createLedgerEntry(
      client,
      transaction.id,
      fromAccountId,
      "DEBIT",
      amount
    );

    await createLedgerEntry(
      client,
      transaction.id,
      toAccountId,
      "CREDIT",
      amount
    );

    const updatedFromAccount = await decreaseAccountBalance(
      client,
      fromAccountId,
      amount
    );

    const updatedToAccount = await increaseAccountBalance(
      client,
      toAccountId,
      amount
    );

    await client.query("COMMIT");

    return {
      transaction,
      fromAccount: updatedFromAccount,
      toAccount: updatedToAccount
    };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};