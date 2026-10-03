import pool from "../config/database.js";
import { PoolClient } from "pg";

export const createAccount = async (
  userId: string,
  accountType: string,
  currency: string
) => {
  const result = await pool.query(
    `
    INSERT INTO accounts (
      user_id,
      account_number,
      account_type,
      currency
    )
    VALUES (
      $1,
      nextval('account_number_seq')::text,
      $2,
      $3
    )
    RETURNING
      id,
      user_id,
      account_number,
      account_type,
      currency,
      balance,
      status,
      created_at,
      updated_at;
    `,
    [userId, accountType, currency]
  );

  return result.rows[0];
};

export const findAccountsByUserId = async (userId: string) => {
  const result = await pool.query(
    `
    SELECT
      id,
      user_id,
      account_number,
      account_type,
      currency,
      balance,
      status,
      created_at,
      updated_at
    FROM accounts
    WHERE user_id = $1
    ORDER BY id;
    `,
    [userId]
  );

  return result.rows;
};

export const increaseAccountBalance = async (
  client: PoolClient,
  accountId: string,
  amount: number
) => {
  const result = await client.query(
    `
    UPDATE accounts
    SET
      balance = balance + $1,
      updated_at = NOW()
    WHERE id = $2
    RETURNING
      id,
      user_id,
      account_number,
      account_type,
      currency,
      balance,
      status,
      created_at,
      updated_at;
    `,
    [amount, accountId]
  );

  return result.rows[0];
};

export const findAccountByIdAndUserId = async (
  client: PoolClient,
  accountId: string,
  userId: string
) => {
  const result = await client.query(
    `
    SELECT
      id,
      user_id,
      account_number,
      account_type,
      currency,
      balance,
      status
    FROM accounts
    WHERE id = $1
      AND user_id = $2;
    `,
    [accountId, userId]
  );

  return result.rows[0];
};

export const findAccountByIdAndUserIdForUpdate = async (
  client: PoolClient,
  accountId: string,
  userId: string
) => {
  const result = await client.query(
    `
    SELECT
      id,
      user_id,
      account_number,
      account_type,
      currency,
      balance,
      status
    FROM accounts
    WHERE id = $1
      AND user_id = $2
    FOR UPDATE;
    `,
    [accountId, userId]
  );

  return result.rows[0];
};

export const decreaseAccountBalance = async (
  client: PoolClient,
  accountId: string,
  amount: number
) => {
  const result = await client.query(
    `
    UPDATE accounts
    SET
      balance = balance - $1,
      updated_at = NOW()
    WHERE id = $2
    RETURNING
      id,
      user_id,
      account_number,
      account_type,
      currency,
      balance,
      status,
      created_at,
      updated_at;
    `,
    [amount, accountId]
  );

  return result.rows[0];
};

export const findAccountByIdForUpdate = async (
  client: PoolClient,
  accountId: string
) => {
  const result = await client.query(
    `
    SELECT
      id,
      user_id,
      account_number,
      account_type,
      currency,
      balance,
      status
    FROM accounts
    WHERE id = $1
    FOR UPDATE;
    `,
    [accountId]
  );

  return result.rows[0];
};