import "dotenv/config";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pool from "./config/database.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const migrationsPath = path.join(__dirname, "../migrations");

const runMigrations = async () => {
  const client = await pool.connect();

  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        filename TEXT NOT NULL UNIQUE,
        applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    const files = (await fs.readdir(migrationsPath))
      .filter((file) => file.endsWith(".sql"))
      .sort();

    const result = await client.query(
      "SELECT filename FROM schema_migrations ORDER BY filename"
    );

    const appliedMigrations = new Set(
      result.rows.map((row) => row.filename)
    );

    for (const file of files) {
      if (appliedMigrations.has(file)) {
        continue;
      }

      console.log(`Running migration: ${file}`);

      const sql = await fs.readFile(
        path.join(migrationsPath, file),
        "utf-8"
      );

      await client.query("BEGIN");

      try {
        await client.query(sql);

        await client.query(
          "INSERT INTO schema_migrations (filename) VALUES ($1)",
          [file]
        );

        await client.query("COMMIT");

        console.log(`Completed migration: ${file}`);
      } catch (error) {
        await client.query("ROLLBACK");
        throw error;
      }
    }

    console.log("Migrations completed successfully.");
  } finally {
    client.release();
  }
};

runMigrations()
  .catch((error) => {
    console.error("Migration failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });