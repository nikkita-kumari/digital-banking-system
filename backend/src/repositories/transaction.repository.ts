import type { PoolClient } from "pg";

export const createTransaction = async (
  client: PoolClient,
  referenceId: string,
  transactionType: string,
  description: string
) => {
  const result = await client.query(
    `
    INSERT INTO transactions (
      transaction_type,
      reference_id,
      description
    )
    VALUES ($1, $2, $3)
    RETURNING
      id,
      transaction_type,
      status,
      reference_id,
      description,
      created_at;
    `,
    [
      transactionType,
      referenceId,
      description
    ]
  );

  return result.rows[0];
};

export const createLedgerEntry = async (
  client: PoolClient,
  transactionId: string,
  accountId: string,
  entryType: string,
  amount: number
) => {
  const result = await client.query(
    `
    INSERT INTO ledger_entries (
      transaction_id,
      account_id,
      entry_type,
      amount
    )
    VALUES ($1, $2, $3, $4)
    RETURNING
      id,
      transaction_id,
      account_id,
      entry_type,
      amount,
      created_at;
    `,
    [
      transactionId,
      accountId,
      entryType,
      amount
    ]
  );

  return result.rows[0];
};

