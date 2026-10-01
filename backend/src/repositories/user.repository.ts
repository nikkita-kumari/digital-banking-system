import pool from "../config/database.js";

export const createUser = async (
  name: string,
  email: string,
  passwordHash: string
) => {
  const result = await pool.query(
    `
    INSERT INTO users (name, email, password_hash)
    VALUES ($1, $2, $3)
    RETURNING id, name, email, role, status, created_at, updated_at;
    `,
    [name, email, passwordHash]
  );

  return result.rows[0];
};

export const findUserByEmail = async (email: string) => {
  const result = await pool.query(
    `
    SELECT id, name, email, password_hash, role, status
    FROM users
    WHERE email = $1;
    `,
    [email]
  );

  return result.rows[0];
};

export const findUserById = async (id: string) => {
  const result = await pool.query(
    `
    SELECT id, name, email, role, status, created_at, updated_at
    FROM users
    WHERE id = $1;
    `,
    [id]
  );

  return result.rows[0];
};